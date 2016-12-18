/* @flow */

import Entity from './Entity';
import {Tile} from './tiles';
import Road from './infrastructure/Road';
import Building from './Building';
import Unit from './Unit';

import {Graph} from 'javascript-astar';

type layerEnum = 'tile' | 'nature' | 'building' | 'unit';

export default class Layer<T: Entity | Tile> {

    id: layerEnum;
    width: number;
    height: number;

    // An unordered collection of each item in this layer
    list: Array<T>;

    // Position matrix marking which coordinates are available for placement
    map: Array<Array<?T>>;

    constructor (width: number, height: number, id: layerEnum) {
        this.width = width;
        this.height = height;
        this.id = id;

        this.list = [];
        this.map = (new Array(height)).fill(null).map(() => (new Array(width)).fill(null));
    }

    // overwrite me
    can_contain (instance: any) : boolean { return true; }

    can_place ([x, y]:Coordinate, width:number=1, height:number=1) {
        if (this.is_box_out_of_bounds([x, y], width, height)) return false;

        for (let row = 0; row < height; ++row) {
            for (let col = 0; col < width; ++col) {
                if (this.get([x + col, y + row])) return false;
            }
        }

        return true;
    }

    is_box_out_of_bounds ([x, y]: Coordinate, w: number, h: number) : boolean {
        return this.is_out_of_bounds([x, y]) || this.is_out_of_bounds([x + w, y + h]);
    }

    is_out_of_bounds ([x, y]:Coordinate) : boolean {
        return x < 0 || x > this.width || y < 0 || y > this.height;
    }

    get ([x, y]: Coordinate) : ?T {
        if (this.is_out_of_bounds([x, y])) return null;
        return this.map[y][x];
    }

    add ([x, y]: Coordinate, instance: T) : void {
        const {WIDTH, HEIGHT, name} = instance.constructor;

        if (!this.can_contain(instance)) {
            throw new Error(`[Layer:${this.id}] Cannot contain: '${name}'`);
        }

        if (!this.can_place([x, y], WIDTH, HEIGHT)) {
            throw new Error(`[Layer:${this.id}] Can't place '${name}' on [${x}, ${y}]`);
        }

        this.list.push(instance);
        for (let yIndex = 0; yIndex < HEIGHT; ++yIndex) {
            for (let xIndex = 0; xIndex < WIDTH; ++xIndex) {
                this.map[y + yIndex][x + xIndex] = instance;
            }
        }
    }
}

export class TileLayer extends Layer<Tile> {
    can_contain (instance: any) { return instance && instance instanceof Tile; }

    fill (mappingFN: (Coordinate) => Tile) : TileLayer {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.add([x, y], mappingFN([x, y]));
            }
        }

        return this;
    }
}

export class NatureLayer extends Layer<Road> {
    // Used in movement
    roadMatrix: Array<Array<0 | 1>>;
    roadGraph: Graph;

    constructor (...args: any) {
        super(...args);
        this.roadMatrix = (new Array(this.height)).fill(null).map(() => (new Array(this.width)).fill(0));
    }

    can_contain (instance: any) { return instance && instance instanceof Road; }

    add (pos: Coordinate, instance: Road) {
        super.add(pos, instance);

        if (!instance || instance instanceof Road) {
            const [x, y] = pos;
            // this.roadMatrix = JSON.parse(JSON.stringify(this.roadMatrix));
            this.roadMatrix[y][x] = !!instance ? 1 : 0;
            this.refresh_road_graph();
        }
    }

    get_graph () { return new Graph(this.roadMatrix); }

    refresh_road_graph () { this.roadGraph = this.get_graph(); }
}

export class BuildingLayer extends Layer<Building> {
    can_contain (instance: any) { return instance && instance instanceof Building; }
}

export class UnitLayer extends Layer<Unit> {
    constructor (...args : any) {
        super(...args);

        // Units can stack so map is useless here
        this.map = [];
    }

    can_contain (instance: any) { return instance && instance instanceof Unit; }

    // @overwrite
    can_place ([x, y]: Coordinate) : boolean {
        return !this.is_box_out_of_bounds([x, y], 1, 1);
    }

    // @overwrite
    get ([x, y]: Coordinate) : ?Unit {
        if (this.is_out_of_bounds([x, y])) return null;
        return this.list.find(unit => unit.pos[0] === x && unit.pos[1] === y) || null;
    }

    get_all ([x, y]: Coordinate) : Array<Unit> {
        if (this.is_out_of_bounds([x, y])) throw new Error(`[Layer:${this.id}] Out of bounds`);
        return this.list.filter(unit => unit.pos[0] === x && unit.pos[1] === y);
    }

    // @overwrite
    add ([x, y]: Coordinate, instance: Unit) {
        const {WIDTH, HEIGHT, name} = instance.constructor;

        if (!this.can_contain(instance)) {
            throw new Error(`[Layer:${this.id}] Cannot contain: '${name}'`);
        }

        if (WIDTH !== 1 || HEIGHT !== 1) {
            throw new Error(`[Layer:${this.id}] Can only contain 1 x 1 Units`);
        }

        if (!this.can_place([x, y])) {
            throw new Error(`[Layer:${this.id}] Can't place '${name}' on [${x}, ${y}]`);
        }

        this.list.push(instance);
    }
}
