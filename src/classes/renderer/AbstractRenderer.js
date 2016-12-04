/* @flow */

import type Engine from '../Engine';

export default class AbstractRenderer {

    engine: Engine;

    constructor (engine: Engine) {
        this.engine = engine;
    }

    render () {
        console.info('OVERWRITE ME')
    }

}
