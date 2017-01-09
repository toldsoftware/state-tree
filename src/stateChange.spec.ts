import { StateChange, mergeStateData, mergeChanges, reverseChanges, DELETE } from './';
import { delay } from './';

describe('mergeStateData with simple state', () => {

    let state = { text: 'A' };
    let state2 = { text: 'B' };

    it('should have merged result', () => {
        let result = mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'B' });
    });

});

describe('mergeStateData with 2 level state', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let state2 = { text: 'B', nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'B', nested: { text: 'B' } });
    });

});

describe('mergeStateData with missing values', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let state2 = { nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'A', nested: { text: 'B' } });
    });

});

describe('mergeStateData with added values', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let state2 = { newItem: 'B', nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'A', newItem: 'B', nested: { text: 'B' } });
    });

});


describe('mergeStateData with DELETE values', () => {

    let state = { text: 'A', nested: { text: 'A' } };
    let state2 = { text: DELETE, nested: { text: 'B' } };

    it('should have merged result', () => {
        let result = mergeStateData([state, state2]);
        expect(result).toEqual({ nested: { text: 'B' } });
    });

});

describe('mergeStateData with multiple changes', () => {

    let state = { text: 'A', nested: { text: 'A', nested2: { text: 'A' } } };
    let state2 = { nested: { nested2: { text: 'B' } } };
    let state3 = { nested: { nested2: { newText: 'C' } } };
    let change4 = { nested: { nested2: { nested3: { text: 'D' } } } };

    it('should have merged result', () => {
        let result = mergeStateData([state, state2, state3, change4]);
        expect(result).toEqual({ text: 'A', nested: { text: 'A', nested2: { text: 'B', newText: 'C', nested3: { text: 'D' } } } });
    });

});


describe('mergeChanges with simple changes', () => {

    type T = ({ text?: string });
    let initialState: T = {};
    let change1: StateChange<T> = { uuid: 'A', oldStateDelta: {}, newStateDelta: { text: 'A' }, metadata: {} };
    let change2: StateChange<T> = { uuid: 'B', oldStateDelta: { text: 'A' }, newStateDelta: { text: 'B' }, metadata: {} };

    it('should have merged result', () => {
        let result = mergeChanges(initialState, [change1, change2]);
        expect(result).toEqual({ text: 'B' });
    });

    it('should ignore duplicated changes', () => {
        let result = mergeChanges(initialState, [change1, change2, change1]);
        expect(result).toEqual({ text: 'B' });
    });

    it('should be reversable (via single steps)', () => {
        let result = mergeChanges(initialState, [change1, change2]);
        expect(result).toEqual({ text: 'B' });
        let reversed1 = reverseChanges(result, [change2]);
        expect(reversed1).toEqual({ text: 'A' });
        let reversed2 = reverseChanges(reversed1, [change1]);
        expect(reversed2).toEqual({});
    });

    it('should be reversable (via multiple steps)', () => {
        let result = mergeChanges(initialState, [change1, change2]);
        expect(result).toEqual({ text: 'B' });
        let reversed1 = reverseChanges(result, [change1, change2]);
        expect(reversed1).toEqual({});
    });

});

