/* @flow */

import type Building from './Building';
import type Entity from 'classes/Entity';
import type Road from './infrastructure/Road';
import type {Tile} from './tiles';

import Unit from './Unit';
import {DirtTile} from 'classes/tiles';
import Layer, {TileLayer, NatureLayer, BuildingLayer, UnitLayer} from './Layer';

import {DIR} from 'utils/constants';

type layer_map_t = $Shape<{
    // Dirt, Water
    tile: TileLayer,

    // Tree, Road
    nature: NatureLayer,

    // House, Bazaar
    building: BuildingLayer,

    // Policeman, Juggler
    unit: UnitLayer,
}>;

export default class World {

    width: number;
    height: number;
    layers: Array<Layer<*>>;

    layer_map: layer_map_t;

    constructor (width:number, height:number) {
        this.width = width;
        this.height = height;

        this.layer_map = {
            tile: (new TileLayer(width, height, 'tile')).fill(() => new DirtTile()),
            nature: new NatureLayer(width, height, 'nature'),
            building: new BuildingLayer(width, height, 'building'),
            unit: new UnitLayer(width, height, 'unit'),
        };

        this.layers = [
            this.layer_map.tile,
            this.layer_map.nature,
            this.layer_map.building,
            this.layer_map.unit,
        ];
    }

    add <T: Tile | Entity> (klass: Class<T>, pos: Coordinate) : T {
        const instance = new klass(this, pos);
        let layer = null;
        for (let index = this.layers.length - 1; index >= 0; --index) {
            if (!this.layers[index].can_contain(instance)) continue;
            layer = this.layers[index];
        }
        if (!layer) throw new Error('Cannot add instance to any layer');
        layer.add(pos, instance);
        instance.on_add_to_world();
        return instance;
    }

    removeEntity (instance: Entity) {
        // TODO
        instance.on_remove_from_world();
    }

    getTile (pos: Coordinate) : ?Tile { return this.layer_map.tile.get(pos); }

    getNature (pos: Coordinate) : ?Road { return this.layer_map.nature.get(pos); }

    getBuilding (pos: Coordinate) : ?Building { return this.layer_map.building.get(pos); }

    is_out_of_bounds (pos:Coordinate) : boolean {
        return this.layers[0].is_out_of_bounds(pos);
    }

    fill<T:Entity> ([aX, aY]:Coordinate, [bX, bY]:Coordinate, klass:Class<T>) : World {
        if (klass.WIDTH != 1 || klass.HEIGHT != 1) {
            throw new Error(`Can only fill with instances of size 1x1: "${klass.name}"`);
        }
        if (this.is_out_of_bounds([aX, aY])) throw new Error('Invalid starting position');
        if (this.is_out_of_bounds([bX, bY])) throw new Error('Invalid ending position');
        const row_inc = aY < bY ? 1 : -1;
        const col_inc = aX < bX ? 1 : -1;
        for (let row = aY; row_inc > 0 ? row <= bY : row >= bY; row += row_inc) {
            for (let col = aX; col_inc > 0 ? col <= bX : col >= bX; col += col_inc) {
                this.add(klass, [col, row]);
            }
        }
        return this;
    }

    step () {
        this.layer_map.building.list.forEach(building => building.step());
        this.layer_map.unit.list.forEach(unit => { unit.step(); });
    }

}
