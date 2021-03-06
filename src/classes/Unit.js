/* @flow */

import Entity from 'classes/Entity';
import Road from 'classes/infrastructure/Road';
import {DIR} from 'utils/constants';
import {move, get_distance, pos_equal} from 'utils/path';

import AStar from 'javascript-astar';

import type Building from './Building';

type behavior = 'wander' | 'target';

export default class Unit extends Entity {

    static COLOR:string = 'black';
    static EFFECTS:Stats = {};
    static EFFECT_RADIUS:number = 2;

    direction: number;
    behavior: behavior = 'wander';
    target: ?{
        destination: Coordinate,
        path: Array<Coordinate>,
        index: number,
    } = null;

    is_road (pos:Coordinate) : boolean {
        if (this.world.is_out_of_bounds(pos)) return false;
        return this.world.getNature(pos) instanceof Road;
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
        this.each_adjacent_aura(this.constructor.EFFECT_RADIUS, (x, y) => {
            const entity = this.world.getBuilding([x, y]);
            if (entity) result.push(entity);
        });
        return result;
    }

    move () {
        if (this.behavior == 'wander') this._moveWander();
        else this._moveTarget();
    }

    _moveWander () { this.pos = move(this.pos, this.direction); }

    _moveTarget () {
        if (!this.target) throw new Error('[Unit] No target');

        const reset = () => {
            this.behavior = 'wander';
            this.target = null;
        };

        const {destination, index, path} = this.target;
        if (index >= path.length || pos_equal(destination, this.pos)) {
            reset();
            return this._moveWander();
        }
        const next = path[index];
        if (!this.is_road(next)) {
            reset();
            return console.warn(`[Unit] Not a road: [${next[0]}, ${next[1]}]`)
        }
        this.pos = next;
        this.target = Object.assign({}, this.target, {
            index: index + 1,
        });
    }

    _set_path_target (destination: Coordinate, path: Array<Coordinate>) {
        this.behavior = 'target';
        this.target = {
            destination,
            path,
            index: 0,
        };
    }

    get_path_to (pos: Coordinate) : ?Array<Coordinate> {
        if (pos_equal(this.pos, pos)) return [];

        const graph = this.world.layer_map.nature.get_graph();
        const start = graph.grid[this.pos[1]][this.pos[0]];
        const end = graph.grid[pos[1]][pos[0]];
        const path = AStar.astar.search(graph, start, end).map(({x, y}) => [y, x]);

        if (!path.length) return null;
        return path;
    }

    move_to (pos: Coordinate) : boolean {
        if (this.world.is_out_of_bounds(pos)) throw new Error('[Unit] Out of bounds');
        if (pos_equal(this.pos, pos)) return true;

        const path = this.get_path_to(pos);

        if (!path) {
            console.warn(`[Unit] ${this.constructor.name} No path found to [${pos[0]}, ${pos[1]}]`);
            return false;
        }
        this._set_path_target(Array.from(pos), path);
        return true;
    }

    move_to_building (building: Building) : boolean {
        const targets = building.get_all_adjacent_roads();
        if (!targets.length) return false;

        let route = null;
        for (let road of targets) {
            const path = this.get_path_to(road.pos);
            if (!path) continue;
            if (route && route.path.length <= path.length) continue;
            route = {pos: road.pos, path};
        }

        if (!route) {
            debugger
            for (let road of targets) {
                const path = this.get_path_to(road.pos);
            }
            console.warn(`[Unit] ${this.constructor.name} No path found to building: ${building.constructor.name}`);

            return false;
        }

        this._set_path_target(route.pos, route.path);
        return true;
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
}
