/* @flow */

import Entity from 'classes/Entity';
import Road from 'classes/infrastructure/Road';

export default class Building extends Entity {

    get_adjacent_road () : ?Road {
        const [x, y] = this.pos;
        let result = null;
        this.each_adjacent(1, (x, y) => {
            const entity = this.world.layer_map.entity[y][x];
            if (entity instanceof Road) {
                result = entity;
                return false;
            }
        });
        return result;
    }

}
