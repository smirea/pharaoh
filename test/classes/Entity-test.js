
import Entity from 'classes/Entity';
import World from 'classes/World';

describe('Entity', function () {

    beforeEach(() => {
        this.world = new World(5, 5);
        this.entity = this.world.add_entity([2, 2], Entity);
    });

    describe('can_add_to_world', () => {

        beforeEach(() => {
            this.each_adjacent = function (size = 1, entity=this.entity) {
                let result = [];
                entity.each_adjacent(size, (x, y) => { result.push(`${x}-${y}`); });
                return result.join(' ');
            };
        });

        it('return all neighbors', () => {
            expect(this.each_adjacent()).to.equal('1-1 2-1 3-1 1-2 3-2 1-3 2-3 3-3');
        });

        it('handles missing sides', () => {
            this.entity.pos = [1, 0];
            expect(this.each_adjacent()).to.equal('0-0 2-0 0-1 1-1 2-1');
        });

        it('handles top left corner', () => {
            this.entity.pos = [0, 0];
            expect(this.each_adjacent()).to.equal('1-0 0-1 1-1');
        });

        it('handles bottom right corner', () => {
            this.entity.pos = [4, 4];
            expect(this.each_adjacent()).to.equal('3-3 4-3 3-4');
        });

        it('handles no neighbors (kinda useless though', () => {
            const world = new World(1, 1);
            const entity = new Entity(world, [0, 0]);
            expect(this.each_adjacent(null, entity)).to.equal('');
        });

        it('handles size 2', () => {
            expect(this.each_adjacent(2)).to.equal('0-0 1-0 2-0 3-0 4-0 0-1 1-1 2-1 3-1 4-1 0-2 1-2 3-2 4-2 0-3 1-3 2-3 3-3 4-3 0-4 1-4 2-4 3-4 4-4');
        });

        it('handles size 0', () => {
            expect(this.each_adjacent(0)).to.equal('');
        });

    });

    describe('apply_effects', () => {

        beforeEach(() => {
            this.effects = {};
            this.test_class = class Test extends Entity {
                static EFFECTS = this.effects;
                static EFFECT_RADIUS = 2;
            };
            this.entity = this.world.add_entity([2, 2], Test);
        });

    });

});
