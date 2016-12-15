/* @flow */

import type World from '../classes/World';

declare type Coordinate = [number, number];

declare type Stats = $Shape<{
    desirability: [number, number, number, number, number, number],
    fire: number,
    damage: number,
    crime: number,
}>;

declare interface WorldItem {
    UID: string;
    on_add_to_world (World, Coordinate) : void;

    step () : void;
};

declare interface WorldItemConstructor {
    COLOR: string;
    WIDTH: number;
    HEIGHT: number;

    constructor (World, Coordinate) : any;

    can_add_to_world (World, Coordinate) : boolean;
};

declare interface EventEmitter {
    _eventListeners: Object;
    on: (string, Function) => void;
    off: (string, Function) => void;
    trigger: (string) => void;
    trigger: (string, Array<mixed>) => void;
};
