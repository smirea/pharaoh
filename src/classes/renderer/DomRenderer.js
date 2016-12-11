/* @flow */

import type Engine from '../Engine';
import AbstractRenderer from './AbstractRenderer';

export default class DomRenderer extends AbstractRenderer {

    element: HTMLElement;

    constructor (engine: Engine) {
        super(engine);
        this.element = document.createElement('div');
        this.element.classList.add('world');
    }

    setupDOM (root: HTMLElement) {
        root.appendChild(this.element);
    }

    clear () {
        this.element.innerHTML =  '';
    }

    paint () {
        const {world} = this.engine;

        const createCell = (bg: string, content: string) => {
            const result = document.createElement('div');
            result.classList.add('world-cell');
            result.style.backgroundColor = bg;
            result.innerHTML = content;
            return result;
        }

        for (let row = -1; row < world.height; ++row) {
            const rowElem = document.createElement('div');
            rowElem.classList.add('world-row');
            for (let col = -1; col < world.width; ++col) {
                let bg = 'red';
                let content = ' ';

                if (row === -1 || col === -1) {
                    bg = 'black'
                    if (row !== col) {
                        if (row === -1) {
                            content = col;
                        } else {
                            content = row;
                        }
                    }
                } else {
                    const units = this.get_units([col, row]);
                    if (units.length) {
                        content = units.length;
                        bg = units[units.length - 1].constructor.COLOR;
                    } else {
                        for (let index = world.layers.length - 1; index >= 0; --index) {
                            const obj = world.layers[index].get([col, row]);
                            if (obj) {
                                bg = obj.constructor.COLOR;
                                break;
                            }
                        }
                    }
                }

                rowElem.appendChild(createCell(bg, '' + content));
            }
            this.element.appendChild(rowElem);
        }
    }

    render () {
        this.clear();
        this.paint();
        return this.element;
    }

}
