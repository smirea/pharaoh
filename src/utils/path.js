/* @flow */

import {DIR} from 'utils/constants';

export const move = ([x, y]:Coordinate, direction:number, size:number = 1) : Coordinate => {
    switch (direction) {
        case DIR.UP: y -= size; break;
        case DIR.RIGHT: x += size; break;
        case DIR.DOWN: y += size; break;
        case DIR.LEFT: x -= size; break;
        default: throw new Error(`Invalid direction "${direction}"`);
    }
    return [x, y];
}


/**
 * Returns the Manhattan distance between two points
 * @param  {Coordinate} start
 * @param  {Coordinate} end
 * @return {Number}
 */
export const get_distance = ([aX, aY]:Coordinate, [bX, bY]:Coordinate) : number => {
    return Math.abs(aX - bX) + Math.abs(aY - bY);
}
