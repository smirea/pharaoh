/* @flow */

import type World from 'classes/World';

import {getUID} from '../../utils/utils';

(x: Tile) => (x: WorldItem);
(x: Class<Tile>) => (x: WorldItemConstructor);
export class Tile {
    static COLOR = 'black';
    static WIDTH = 1;
    static HEIGHT = 1;

    UID: string;

    constructor () {
        this.UID = getUID();
    }

    static can_add_to_world (world:World, pos:Coordinate) : boolean {
        return !!world.getNature(pos);
    }

    on_add_to_world (world:any, pos: any) : void {}

    step () {}
}

export class DirtTile extends Tile {
    static COLOR = 'white';
}
