/* @flow */

import type World from './World';

import {getUID} from '../utils/utils';

(x: Entity) => (x: WorldItem);
(x: Class<Entity>) => (x: WorldItemConstructor);
export default class Entity {

    static COLOR = 'black';
    static WIDTH = 1;
    static HEIGHT = 1;

    UID: string;

    pos:Coordinate;
    world:World;
    stats:{[key: $Keys<Stats>]: number};

    constructor (world:World, pos:Coordinate) {
        this.UID = getUID();

        this.pos = pos;
        this.world = world;

        this.stats = {
            desirability: 0,
            fire: 0,
            damage: 0,
            crime: 0,
        };
    }

    static can_add_to_world (world:World, [x, y]:Coordinate) : boolean {
        return true;
    }

    on_add_to_world () : void {}

    on_remove_from_world () : void {}

    step () : void {}

    add_stat (stat:$Keys<Stats>, value:number) {
        this.stats[stat] += value;
    }

    /**
     * Calls a callback on each neighboring coordinate
     * Callbacks are called clockwise from top-left
     *
     * x - origin
     * @ - callback([x, y])
     *
     *    0 1 2 3 4 5
     *  0 . . . . . .
     *  1 . . @ @ . .
     *  2 . @ x x @ .
     *  3 . . @ @ . .
     *  4 . . . . . .
     *
     */
    each_vicinity (callback:(x:number, y:number) => ?boolean) : void {
        const {WIDTH, HEIGHT} = this.constructor;
        const [x, y] = this.pos;

        // Top row
        if (y - 1 >= 0) {
            for (let index = x; index < x + WIDTH; ++index) {
                if (callback(index, y - 1) === false) return;
            }
        }

        // Right Column
        if (x + WIDTH < this.world.width) {
            for (let index = y; index < y + HEIGHT; ++index) {
                if (callback(x + WIDTH, index) === false) return;
            }
        }

        // Bottom Row
        if (y + HEIGHT < this.world.height) {
            for (let index = x + WIDTH - 1; index >= x; --index) {
                if (callback(index, y + HEIGHT) === false) return;
            }
        }

        // Left Column
        if (x - 1 >= 0) {
            for (let index = y + HEIGHT - 1; index >= y; --index) {
                if (callback(x - 1, index) === false) return;
            }
        }
    }

    /**
     * Calls a callback on each coordinate in a given radius
     *
     * x - origin
     * @ - callback([x, y])
     *
     * radius = 1
     *
     *    0 1 2 3 4 5
     *  0 . . . . . .
     *  1 . @ @ @ @ .
     *  2 . @ x x @ .
     *  3 . @ @ @ @ .
     *  4 . . . . . .
     *
     */
    each_adjacent_aura (radius:number = 1, callback:(x:number, y:number) => ?boolean) : void {
        const {WIDTH, HEIGHT} = this.constructor;
        const [x, y] = this.pos;
        const start_row = Math.max(0, y - radius);
        const end_row = Math.min(this.world.height, y + HEIGHT + radius);
        const start_col = Math.max(0, x - radius);
        const end_col = Math.min(this.world.width, x + WIDTH + radius);

        outer: for (let row = start_row; row < end_row; ++row) {
            for (let col = start_col; col < end_col; ++col) {
                if (col < x || col >= x + WIDTH || row < y || row >= y + HEIGHT) {
                    if (callback(col, row) === false) break outer;
                }
            }
        }
    }
}
