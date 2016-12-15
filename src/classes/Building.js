/* @flow */

import Entity from 'classes/Entity';
import Road from 'classes/infrastructure/Road';

(x: Building) => (x: WorldItem);
(x: Class<Building>) => (x: WorldItemConstructor);
export default class Building extends Entity {

    get_adjacent_road () : ?Road {
        const [x, y] = this.pos;
        let result = null;
        this.each_vicinity((x, y) => {
            const entity = this.world.getNature([x, y]);
            if (entity && entity instanceof Road) {
                result = entity;
                return false;
            }
        });
        return result;
    }

    get_all_adjacent_roads () : Array<Road> {
        const [x, y] = this.pos;
        const result = [];

        this.each_vicinity((x, y) => {
            const entity = this.world.getNature([x, y]);
            if (!entity || !(entity instanceof Road)) return;
            result.push(entity);
        });

        return result;
    }

}
