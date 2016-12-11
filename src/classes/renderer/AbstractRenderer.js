/* @flow */

import type Engine from '../Engine';
import type Unit from '../Unit';

export default class AbstractRenderer {

    engine: Engine;

    constructor (engine: Engine) {
        this.engine = engine;
    }

    get_units (pos: Coordinate) : Array<Unit> {
        return this.engine.world.layer_map.unit.get_all(pos);
    }

    setupDOM (root: HTMLElement) {
        // noop
    }

    render () {
        throw new Error('OVERWRITE ME');
    }

}
