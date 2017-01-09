import { mergeChanges, DELETE } from './';
import { delay } from './../';

describe('mergeChanges with simple state', () => {

    let state = { text: 'A' };
    let change = { text: 'B' };

    it('should have merged result', () => {
        let result = mergeChanges([state, change]);
        expect(result).toEqual({ text: 'B' });
    });

});

describe('mergeChanges with 2 level state', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let change = { text: 'B', nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeChanges([state, change]);
        expect(result).toEqual({ text: 'B', nested: { text: 'B' } });
    });

});

describe('mergeChanges with missing values', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let change = { nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeChanges([state, change]);
        expect(result).toEqual({ text: 'A', nested: { text: 'B' } });
    });

});

describe('mergeChanges with added values', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let change = { newItem: 'B', nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeChanges([state, change]);
        expect(result).toEqual({ text: 'A', newItem: 'B', nested: { text: 'B' } });
    });

});


describe('mergeChanges with DELETE values', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let change = { text: DELETE, nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeChanges([state, change]);
        expect(result).toEqual({ nested: { text: 'B' } });
    });

});

describe('mergeChanges with multiple changes', () => {

    let state = { text: 'A', nested: { text: 'A', nested2: { text: 'A' } } };
    let change = { nested: { nested2: { text: 'B' } } };
    let change2 = { nested: { nested2: { newText: 'C' } } };
    let change3 = { nested: { nested2: { nested3: { text: 'D' } } } };

    it('should have merged result', () => {
        let result = mergeChanges([state, change, change2, change3]);
        expect(result).toEqual({ text: 'A', nested: { text: 'A', nested2: { text: 'B', newText: 'C', nested3: { text: 'D' } } } });
    });

});