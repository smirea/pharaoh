/* @flow */

import World from 'classes/World';

import type AbstractRenderer from './renderer/AbstractRenderer';
import ConsoleRenderer from './renderer/ConsoleRenderer';
import DomRenderer from './renderer/DomRenderer';

const rendererMap = {
    console: ConsoleRenderer,
    dom: DomRenderer,
};

type engineOptions = {
    fps: number,
    renderer: $Keys<typeof rendererMap>,
    world: {
        width: number,
        height: number,
    },
};

export default class Engine {

    world: World;
    renderer: AbstractRenderer;
    options: engineOptions;

    constructor (options:engineOptions) {
        this.options = options;
        this.world = new World(options.world.width, options.world.height);

        const renderCls = rendererMap[options.renderer];
        this.renderer = new renderCls(this);
    }

    setupDOM (root: HTMLElement) {
        const container = document.createElement('div');
        container.classList.add('engine');
        // container.engine = this;
        root.appendChild(container);
        this.setupControlls(container);
        this.renderer.setupDOM(container);
        return container;
    }

    setupControlls (root: HTMLElement) {
        const btn = (text, handler) => {
            const elem = document.createElement('button');
            elem.innerHTML = text;
            elem.addEventListener('click', handler);
            return elem;
        }

        let interval = null;
        const step = () => this.step();
        const stop = () => interval != null ? clearInterval(interval) : null;
        const run = () => {
            stop();
            interval = setInterval(step, 200);
        };

        const container = document.createElement('div');
        container.classList.add('actions');
        root.appendChild(container);

        container.appendChild(btn('step', step));
        container.appendChild(btn('run', run));
        container.appendChild(btn('stop', stop));
    }

    start () {}

    stop () {}

    step ({render = true} : {render: bool} = {}) {
        this.world.step();
        if (render) this.render();
    }

    render () {
        this.renderer.render();
    }

}
