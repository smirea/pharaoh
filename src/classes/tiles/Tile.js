/* @flow */

import type World from 'classes/World';

export default class Tile {
    static COLOR = 'black';
    static WIDTH = 1;
    static HEIGHT = 1;

    can_add_to_world (world:World, [x, y]:Coordinate) : ?string {
        if (world.layer_map.entity.get([x, y])) return `Tile already exists at [${x}, ${y}]`;
        return null;
    }

    on_add_to_world (world:any, pos: any) : void {}
}
