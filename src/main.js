/* @flow */

import Engine from 'classes/Engine';
import {DIR} from 'utils/constants';
import {move} from 'utils/path';

import Entity from 'classes/Entity';
import Road from 'classes/infrastructure/Road';
import * as HouseIndex from 'classes/HouseIndex';

import {Policeman} from 'classes/PoliceStation';

const engine = new Engine({
    fps: 30,
    renderer: 'dom',
    world: {
        width: 12,
        height: 14,
    }
});

const road = (w:World, pos:Coordinate, direction:number, size:number) : Coordinate => {
    --size;
    const end = move(pos, direction, size);
    w.fill(pos, end, Road);
    return end;
}

const roadChain = (w:World, pos:Coordinate, ...sections:Array<[number, number]>) => {
    sections.forEach(([dir, size], index) => {
        if (index > 0) pos = move(pos, dir);
        pos = road(w, pos, dir, size);
    });
}

const setupIntersection = () => {
    roadChain(engine.world, [2, 4], [DIR.RIGHT, 7], [DIR.DOWN, 6], [DIR.LEFT, 6], [DIR.UP, 5]);
    roadChain(engine.world, [5, 5], [DIR.DOWN, 5]);
    roadChain(engine.world, [3, 7], [DIR.RIGHT, 2]);
    roadChain(engine.world, [6, 7], [DIR.RIGHT, 2]);
    engine.world.add_entity([3, 3], HouseIndex.SmallHouse);
    engine.world.add_entity([5, 2], HouseIndex.MediumHouse);
    engine.world.add_entity([8, 0], HouseIndex.LargeHouse);
    engine.world.add_unit(new Policeman(engine.world, [3, 4]));
    engine.world.add_unit(new Policeman(engine.world, [5, 8]));
};

const setupPlain = () => {
    roadChain(engine.world, [4, 4], [DIR.DOWN, 5], [DIR.RIGHT, 2], [DIR.LEFT, 4]);
    engine.world.add_unit(new Policeman(engine.world, [4, 4]));
};

setupPlain();

engine.renderer.setupDOM(document.body);
engine.render();

// window.interval = setInterval(() => {engine.step();}, 250);

window.engine = engine;
