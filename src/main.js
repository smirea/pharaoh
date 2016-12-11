/* @flow */

import Engine from 'classes/Engine';
import {DIR} from 'utils/constants';
import {move} from 'utils/path';

import type Entity from 'classes/Entity';
import type Building from './classes/Building';
import Road from 'classes/infrastructure/Road';
import * as HouseIndex from 'classes/HouseIndex';

import {Policeman} from 'classes/PoliceStation';

const init = () => {
    const options = {
        fps: 30,
        renderer: 'dom',
        world: {
            width: 12,
            height: 14,
        }
    };

    const e1 = new Engine(options);
    setupPlain(e1);
    e1.setupDOM(document.body);
    e1.render();
    window.e1 = e1;

    const e2 = new Engine(options);
    setupIntersection(e2);
    e2.setupDOM(document.body);
    e2.render();
    window.e2 = e2;

    const e3 = new Engine(options);
    setupWalk(e3);
    e3.setupDOM(document.body);
    e3.render();
    window.e3 = e3;
};


const setupPlain = engine => {
    roadChain(engine.world, [4, 4], 'down 5', 'right 2', 'up 4', 'left 1');
    engine.world.add(Policeman, [4, 4]);
};

const setupIntersection = engine => {
    const {world} = engine;

    roadChain(world, [2, 4], 'right 7', 'down 6', 'left 6', 'up 5');
    roadChain(world, [5, 5], 'down 5');
    roadChain(world, [3, 7], 'right 2');
    roadChain(world, [6, 7], 'right 2');
    world.add(HouseIndex.SmallHouse, [3, 3]);
    world.add(HouseIndex.MediumHouse, [5, 2]);
    world.add(HouseIndex.LargeHouse, [8, 0]);
    world.add(Policeman, [3, 4]);
    world.add(Policeman, [5, 8]);
};

const setupWalk = engine => {
    const {world} = engine;

    roadChain(world, [2, 6], 'down 4', 'right 4', 'up 3', 'right 4', 'up 3', 'left 8', 'down 2');
    window.unit = world.add(Policeman, [2, 6]);
    const h1 = world.add(HouseIndex.SmallHouse, [10, 2]);
    const h2 = world.add(HouseIndex.SmallHouse, [11, 6]);
    const h3 = world.add(HouseIndex.SmallHouse, [7, 9]);

    engine.on('render', () => {
        const setText = (cell: Entity, val) => {
            const [x, y] = cell.pos;
            if (!engine.renderer.element) return;
            const target = engine.renderer.element.querySelector(`[data-row="${y}"][data-column="${x}"]`);
            target.innerHTML = val;
            target.style.color = 'black';
            target.style.fontSize = '16px';
        }
        setText(h1, 1);
        setText(h2, 2);
        setText(h3, 3);

        const container = document.createElement('div');
        engine.renderer.element.appendChild(container);
        const makeButton = (label, onclick) => {
            const btn = document.createElement('button');
            btn.onclick = onclick;
            btn.innerHTML = label;
            container.appendChild(btn);
        };

        const moveToBuilding = ({pos: [x, y]}:Building) => {
            const layer = engine.world.layer_map.nature;
            const clone = JSON.parse(JSON.stringify(layer.roadMatrix));
            clone[y][x] = 1;
            layer.roadMatrix = clone;
            layer.refreshRoadGraph();
            if (!unit.moveTo([x, y])) return;
            engine.start();
        };

        makeButton('move to 1', () => moveToBuilding(h1));
        makeButton('move to 2', () => moveToBuilding(h2));
        makeButton('move to 3', () => moveToBuilding(h3));
    });

};

const road = (w:World, pos:Coordinate, direction:number, size:number) : Coordinate => {
    --size;
    const end = move(pos, direction, size);
    w.fill(pos, end, Road);
    return end;
}

const roadChain = (w:World, pos:Coordinate, ...sections:Array<string>) => {
    sections.forEach((str, index) => {
        let [dir, size] = str.split(/ /);
        dir = DIR[dir.toUpperCase()];
        size = parseInt(size);
        if (index > 0) pos = move(pos, dir);
        pos = road(w, pos, dir, size);
    });
}

init();
