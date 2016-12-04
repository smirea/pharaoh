/* @flow */

import AbstractRenderer from './AbstractRenderer';

export default class ConsoleRenderer extends AbstractRenderer {

    print () {
        const {world} = this.engine;

        let matrix = [];
        const styles = [];

        for (let row = -1; row < world.height; ++row) {
            const tmp = []
            for (let col = -1; col < world.width; ++col) {
                let bg = 'red';
                let char = ' ';

                if (row === -1 || col === -1) {
                    bg = 'black'
                    if (row !== col) {
                        if (row === -1) {
                            char = col % 10;
                        } else {
                            char = row % 10;
                        }
                    }
                } else {
                    const units = this.get_units([col, row]);
                    if (units.length) {
                        char = units.length;
                        bg = units[units.length - 1].constructor.COLOR;
                    } else {
                        for (let index = world.layers.length - 1; index >= 0; --index) {
                            const obj = world.layers[index].map[row][col];
                            if (obj) {
                                bg = obj.constructor.COLOR;
                                break;
                            }
                        }
                    }
                }
                tmp.push(`%c${char}`);
                styles.push(`
                    color: #eee;
                    background: ${bg};
                    border-left: 1px solid #aaa;
                    text-decoration: underline;
                `);
            }
            matrix.push(tmp.join(' '));
        }
        matrix = matrix.join('\n');
        console.log(matrix, ...styles);
        return this;
    }

    render () {
        console.clear();
        this.print();
    }

}
