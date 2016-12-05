/* @flow */

import type Entity from 'classes/Entity';
import type Tile from 'classes/tiles/Tile';
import type Unit from 'classes/Unit';
// import type {Graph} from '../lib/AStar';

import DirtTile from 'classes/tiles/DirtTile';
import {DIR} from 'utils/constants';


type layer_map_t = $Shape<{
    tile: Layer<?Tile>,
    entity: Layer<?Entity>,
}>;

export default class World {

    data: Array<Array<Entity>>;
    width: number;
    height: number;
    layers: Array<Layer<*>>;
    units: Array<Unit>;

    // TODO: figure out why this is not working
    // layer_map: layer_map_t;
    layer_map: {
        tile: Layer<*>,
        entity: Layer<*>,
    }

    // // Everything that is not an unpassable entity is stored here
    // search_graph: Graph;

    // // This is only a graph of the roads
    // road_search_graph: Graph;

    constructor (width:number, height:number) {
        this.width = width;
        this.height = height;
        this.units = [];

        this.layer_map = {
            tile: new Layer(this.width, this.height, 'tile', () => new DirtTile()),
            entity: new Layer(this.width, this.height, 'entity', () => null),
        };

        this.layers = [this.layer_map.tile, this.layer_map.entity];
    }

    // update_search_graphs () {

    // }

    is_out_of_bounds ([x, y]:Coordinate) : boolean {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    add_unit (instance:Unit) : boolean {
        this.remove_unit(instance);
        this.units.push(instance);
        instance.on_add_to_world();
        return true;
    }

    remove_unit (instance:Unit) {
        const index = this.units.indexOf(instance);
        if (index === -1) return;
        this.units.splice(index, 1);
        instance.on_remove_from_world();
    }

    add_entity<T:Entity> (pos:Coordinate, klass:Class<T>) : ?T {
        const [x, y] = pos;
        const error = klass.can_add_to_world(this, pos);
        if (error) {
            console.error(error);
            return null;
        }
        const instance = new klass(this, pos);
        for (let row = 0; row < klass.HEIGHT; ++row) {
            for (let col = 0; col < klass.WIDTH; ++col) {
                this.layer_map.entity.set([x + col, y + row], instance);
            }
        }
        instance.on_add_to_world(this, pos);
        return instance;
    }

    fill<T:Entity> ([aX, aY]:Coordinate, [bX, bY]:Coordinate, klass:Class<T>) : World {
        if (klass.WIDTH != 1 || klass.HEIGHT != 1) {
            throw new Error('Can only fill with instances of size 1x1: "`${klass.name}`"');
        }
        if (this.is_out_of_bounds([aX, aY])) throw new Error('Invalid starting position');
        if (this.is_out_of_bounds([bX, bY])) throw new Error('Invalid ending position');
        const row_inc = aY < bY ? 1 : -1;
        const col_inc = aX < bX ? 1 : -1;
        for (let row = aY; row_inc > 0 ? row <= bY : row >= bY; row += row_inc) {
            for (let col = aX; col_inc > 0 ? col <= bX : col >= bX; col += col_inc) {
                this.add_entity([col, row], klass);
            }
        }
        return this;
    }

    step () {
        this.units.forEach((unit) => {
            unit.step();
        });
    }

}

class Layer<T> {

    width: number;
    height: number;
    key: $Keys<layer_map_t>;
    getDefaultValue: (x: number, y: number) => ?T;

    map: Array<Array<?T>>;

    constructor (
        width: number,
        height: number,
        key: $Keys<layer_map_t>,
        getDefaultValue: (x: number, y: number) => ?T
    ) {
        this.width = width;
        this.height = height;
        this.key = key;
        this.getDefaultValue = getDefaultValue;
        this.init();
    }

    init () {
        this.map = [];

        for (let index = 0; index < this.height; ++index) {
            const row = [];
            for (let col_index = 0; col_index < this.width; ++col_index) {
                row.push(this.getDefaultValue(index, col_index));
            }
            this.map.push(row);
        }
    }

    is_out_of_bounds ([x, y]:Coordinate) : boolean {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    get ([x, y]: Coordinate) : ?T {
        if (this.is_out_of_bounds([x, y])) return null;
        return this.map[y][x];
    }

    set ([x, y]: Coordinate, value: ?T) {
        if (this.is_out_of_bounds([x, y])) return;
        this.map[y][x] = value;
    }

}
