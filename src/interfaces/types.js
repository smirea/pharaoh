
import World from '../classes/World';

declare type Coordinate = [number, number];

declare type Stats = $Shape<{
    desirability: [number, number, number, number, number, number],
    fire: number,
    damage: number,
    crime: number,
}>;
