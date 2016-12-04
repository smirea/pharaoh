/* @flow */

import World from 'classes/World';

type engineOptions = {
    fps: number,
    world: {
        width: number,
        height: number,
    },
};

export default class Engine {

    world: World;
    options: engineOptions;

    constructor (options:engineOptions) {
        this.options = options;
        this.world = new World(options.world.width, options.world.height);
    }

    start () {}

    stop () {}

    step () {
        this.world.step();
    }

}
