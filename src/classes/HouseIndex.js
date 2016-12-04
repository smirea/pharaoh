/* @flow */

import World from 'classes/World';
import Building from 'classes/Building';
import Road from 'classes/infrastructure/Road';

export class House extends Building {
    static COLOR = 'orange';

    on_add_to_world () {
        if (!this.get_adjacent_road()) console.warn(`${this.constructor.name} must be placed near a road`);
    }
}

export class VacantLot extends House {}

export class SmallHouse extends House {}

export class MediumHouse extends House {
    static WIDTH = 2;
    static HEIGHT = 2;
}
export class LargeHouse extends House {
    static WIDTH = 3;
    static HEIGHT = 3;
}
