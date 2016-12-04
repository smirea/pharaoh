/* @flow */

import World from 'classes/World';

export default class Tile {
    static COLOR = 'black';
    static WIDTH = 1;
    static HEIGHT = 1;

    can_add_to_world (world:World, [x, y]:Coordinate) : ?string {
        if (world.layer_map.entity[y][x]) return `Tile already exists at [${x}, ${y}]`;
        return null;
    }

    on_add_to_world (world:any, pos: any) : void {}
}
