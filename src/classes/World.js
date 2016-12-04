/* @flow */

import Entity from 'classes/Entity';
import Unit from 'classes/Unit';
import Tile from 'classes/tiles/Tile';
import DirtTile from 'classes/tiles/DirtTile';
import {DIR} from 'utils/constants';

type Layer<T> = {
    key: string,
    map: Array<Array<T>>
};

type layer_map_t = $Shape<{
    tile: Array<Array<Tile>>,
    entity: Array<Array<Entity>>,
}>

export default class World {

    data: Array<Array<Entity>>;
    width: number;
    height: number;
    layers: Array<Layer>;
    layer_map: layer_map_t;
    units: Array<Unit>;

    constructor (width:number, height:number) {
        this.width = width;
        this.height = height;
        this.units = [];
        this.layers = [
            this.build_layer('tile', () => new DirtTile()),
            this.build_layer('entity', null),
        ];
        this.layer_map = {};
        this.layers.forEach(({key, map}) => this.layer_map[key] = map);
    }

    build_layer (key:$Keys<layer_map_t>, value:any) : Layer {
        const result = {key, map: []};
        for (let index = 0; index < this.height; ++index) {
            const row = [];
            for (let col_index = 0; col_index < this.width; ++col_index) {
                row.push(typeof value === 'function' ? value(index, col_index) : value);
            }
            result.map.push(row);
        }
        return result;
    }

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
                this.layer_map.entity[y + row][x + col] = instance;
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
        console.clear();
        this.print();
    }

    print () : World {
        let matrix = [];
        const styles = [];

        const get_units = (x, y) => {
            return this.units.filter(({pos}) => pos[0] === x && pos[1] === y);
        }

        for (let row = -1; row < this.height; ++row) {
            const tmp = []
            for (let col = -1; col < this.width; ++col) {
                let bg = 'red';
                let char = ' ';

                if (row === -1 || col === -1) {
                    bg = 'black'
                    if (row !== col) {
                        if (row === -1) {
                            char = col % 10;
                        } else {
                            char = row % 10;
                        }
                    }
                } else {
                    const units = get_units(col, row);
                    if (units.length) {
                        char = units.length;
                        bg = units[units.length - 1].constructor.COLOR;
                    } else {
                        for (let index = this.layers.length - 1; index >= 0; --index) {
                            const obj = this.layers[index].map[row][col];
                            if (obj) {
                                bg = obj.constructor.COLOR;
                                break;
                            }
                        }
                    }
                }
                tmp.push(`%c${char}`);
                styles.push(`
                    color: #eee;
                    background: ${bg};
                    border-left: 1px solid #aaa;
                    text-decoration: underline;
                `);
            }
            matrix.push(tmp.join(' '));
        }
        matrix = matrix.join('\n');
        console.log(matrix, ...styles);
        return this;
    }
}
