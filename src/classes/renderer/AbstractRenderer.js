/* @flow */

import type Engine from '../Engine';
import type Unit from '../Unit';

export default class AbstractRenderer {

    engine: Engine;

    constructor (engine: Engine) {
        this.engine = engine;
    }

    get_units ([x, y]: Coordinate) : Array<Unit> {
        return this.engine.world.units.filter(({pos}) => pos[0] === x && pos[1] === y);
    }

    setupDOM (root: HTMLElement) {
        // noop
    }

    render () {
        throw new Error('OVERWRITE ME');
    }

}
