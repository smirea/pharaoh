/* @flow */

import World from 'classes/World';

import type AbstractRenderer from './renderer/AbstractRenderer';
import ConsoleRenderer from './renderer/ConsoleRenderer';
import DomRenderer from './renderer/DomRenderer';

import {EventEmitterMixin} from '../utils/event';

const rendererMap = {
    // console: ConsoleRenderer,    // Disabled for now
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
    renderer: DomRenderer | ConsoleRenderer;
    options: engineOptions;

    // TODO: EventEmitter - can't make Flow understand mixins :|
    _eventListeners: Object;
    on: (string, Function) => void;
    off: (string, Function) => void;
    trigger: (string, args:?Array<mixed>) => void;

    constructor (options:engineOptions) {
        EventEmitterMixin(this);

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

        const container = document.createElement('div');
        container.classList.add('actions');
        root.appendChild(container);

        container.appendChild(btn('step', () => this.step()));
        container.appendChild(btn('run', () => this.start()));
        container.appendChild(btn('stop', () => this.stop()));
    }

    _interval: ?number;

    start () {
        this.stop();
        this._interval = setInterval(() => this.step(), 200);
    }

    stop () {
        if (this._interval == null) return;
        clearInterval(this._interval);
    }

    step ({render = true} : {render: bool} = {}) {
        this.world.step();
        this.trigger('step');
        if (render) this.render();
    }

    render () {
        this.renderer.render();
        this.trigger('render');
    }

}
