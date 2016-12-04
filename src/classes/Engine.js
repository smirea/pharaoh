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

    start () {}

    stop () {}

    step ({render = true} : {render: bool} = {}) {
        this.world.step();
        console.log(render)
        if (render) this.render();
    }

    render () {
        this.renderer.render();
    }

}
