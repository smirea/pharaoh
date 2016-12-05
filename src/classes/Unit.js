/* @flow */

import Entity from 'classes/Entity';
import Road from 'classes/infrastructure/Road';
import {DIR} from 'utils/constants';
import {move, get_distance} from 'utils/path';

type behavior =
    | 'wander'
    | 'target';

export default class Unit extends Entity {

    static COLOR:string = 'black';
    static EFFECTS:Stats = {};
    static EFFECT_RADIUS:number = 2;

    direction: number;
    behavior: behavior = 'wander';
    target: ?Entity = null;

    is_road (pos:Coordinate) : boolean {
        if (this.world.is_out_of_bounds(pos)) return false;
        return this.world.layer_map.entity.get(pos) instanceof Road;
    }

    get_road_directions () : Array<number> {
        const result = [];
        if (this.is_road(move(this.pos, DIR.UP))) result.push(DIR.UP);
        if (this.is_road(move(this.pos, DIR.RIGHT))) result.push(DIR.RIGHT);
        if (this.is_road(move(this.pos, DIR.DOWN))) result.push(DIR.DOWN);
        if (this.is_road(move(this.pos, DIR.LEFT))) result.push(DIR.LEFT);
        return result;
    }

    get_affected_entities () : Array<Entity> {
        const result = [];
        this.each_adjacent(this.constructor.EFFECT_RADIUS, (x, y) => {
            const entity = this.world.layer_map.entity.get([x, y]);
            if (entity) result.push(entity);
        });
        return result;
    }

    move () {
        this.pos = move(this.pos, this.direction);
    }

    apply_effects () {
        const targets = this.get_affected_entities();
        Object.keys(this.constructor.EFFECTS).forEach((stat) => {
            const value = this.constructor.EFFECTS[stat];
            targets.forEach((entity) => {
                let stat_value = 0;
                if (Array.isArray(value)) {
                    const distance = get_distance(this.pos, entity.pos);
                    if (distance < value.length) {
                        stat_value = value[distance];
                    } else {
                        stat_value = 0;
                    }
                } else {
                    stat_value = value;
                }
                entity.add_stat(stat, stat_value);
            });
        })
    }

    step () {
        this.step_move();
        this.step_act();
    }

    step_move () {
        const [x, y] = this.pos;
        let dirs = this.get_road_directions();

        if (!this.is_road(this.pos)) throw new Error(`${this.constructor.name} is not on a road`);

        // If there are no roads to go to, don't do anything
        if (!dirs.length) return;

        if (this.direction) {
            // It should never try to turn back if there is any other option
            if (dirs.length > 1) dirs = dirs.filter((dir) => dir != this.direction * -1);
        }

        this.direction = dirs[Math.floor(Math.random() * dirs.length)];
        this.move();
    }

    step_act () {
        this.apply_effects();
    }

    on_add_to_world () {}

    on_remove_from_world () {}
}
