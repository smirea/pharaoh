/* @flow */

import Building from 'classes/Building';
import Unit from 'classes/Unit';

export default class PoliceStation extends Building {
    static COLOR = 'black';
}

export class Policeman extends Unit {
    static COLOR = 'blue';
}
