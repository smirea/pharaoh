/* @flow */

import type World from './World';

export default class Entity {

    static COLOR = 'black';
    static WIDTH = 1;
    static HEIGHT = 1;

    pos:Coordinate;
    world:World;
    stats:{[key: $Keys<Stats>]: number};

    constructor (world:World, pos:Coordinate) {
        this.pos = pos;
        this.world = world;

        this.stats = {
            desirability: 0,
            fire: 0,
            damage: 0,
            crime: 0,
        };
    }

    static can_add_to_world (world:World, [x, y]:Coordinate) : ?string {
        for (let row = 0; row < this.HEIGHT; ++row) {
            for (let col = 0; col < this.WIDTH; ++col) {
                if (world.layer_map.entity.get([x + col, y + row])) return `Needs to be placed on an empty tile`;
            }
        }
        return null;
    }

    on_add_to_world (world:World, [x, y]:Coordinate) : void {}

    add_stat (stat:$Keys<Stats>, value:number) {
        this.stats[stat] += value;
    }

    each_adjacent (size:number = 1, callback:(x:number, y:number) => ?boolean) : void {
        const {WIDTH, HEIGHT} = this.constructor;
        const [x, y] = this.pos;
        const start_row = Math.max(0, y - size);
        const end_row = Math.min(this.world.height, y + HEIGHT + size);
        const start_col = Math.max(0, x - size);
        const end_col = Math.min(this.world.width, x + WIDTH + size);
        outer: for (let row = start_row; row < end_row; ++row) {
            for (let col = start_col; col < end_col; ++col) {
                if (col < x || col >= x + WIDTH || row < y || row >= y + HEIGHT) {
                    if (callback(col, row) === false) break outer;
                }
            }
        }
    }
}
