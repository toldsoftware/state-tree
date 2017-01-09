"use strict";
var _1 = require("./");
describe('mergeStateData with simple state', function () {
    var state = { text: 'A' };
    var state2 = { text: 'B' };
    it('should have merged result', function () {
        var result = _1.mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'B' });
    });
});
describe('mergeStateData with 2 level state', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var state2 = { text: 'B', nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'B', nested: { text: 'B' } });
    });
});
describe('mergeStateData with missing values', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var state2 = { nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'A', nested: { text: 'B' } });
    });
});
describe('mergeStateData with added values', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var state2 = { newItem: 'B', nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeStateData([state, state2]);
        expect(result).toEqual({ text: 'A', newItem: 'B', nested: { text: 'B' } });
    });
});
describe('mergeStateData with DELETE values', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var state2 = { text: _1.DELETE, nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeStateData([state, state2]);
        expect(result).toEqual({ nested: { text: 'B' } });
    });
});
describe('mergeStateData with multiple changes', function () {
    var state = { text: 'A', nested: { text: 'A', nested2: { text: 'A' } } };
    var state2 = { nested: { nested2: { text: 'B' } } };
    var state3 = { nested: { nested2: { newText: 'C' } } };
    var change4 = { nested: { nested2: { nested3: { text: 'D' } } } };
    it('should have merged result', function () {
        var result = _1.mergeStateData([state, state2, state3, change4]);
        expect(result).toEqual({ text: 'A', nested: { text: 'A', nested2: { text: 'B', newText: 'C', nested3: { text: 'D' } } } });
    });
});
describe('mergeChanges with simple changes', function () {
    var initialState = {};
    var change1 = { uuid: 'A', oldStateDelta: {}, newStateDelta: { text: 'A' }, metadata: {} };
    var change2 = { uuid: 'B', oldStateDelta: { text: 'A' }, newStateDelta: { text: 'B' }, metadata: {} };
    it('should have merged result', function () {
        var result = _1.mergeChanges(initialState, [change1, change2]);
        expect(result).toEqual({ text: 'B' });
    });
    it('should ignore duplicated changes', function () {
        var result = _1.mergeChanges(initialState, [change1, change2, change1]);
        expect(result).toEqual({ text: 'B' });
    });
    it('should be reversable (via single steps)', function () {
        var result = _1.mergeChanges(initialState, [change1, change2]);
        expect(result).toEqual({ text: 'B' });
        var reversed1 = _1.reverseChanges(result, [change2]);
        expect(reversed1).toEqual({ text: 'A' });
        var reversed2 = _1.reverseChanges(reversed1, [change1]);
        expect(reversed2).toEqual({});
    });
    it('should be reversable (via multiple steps)', function () {
        var result = _1.mergeChanges(initialState, [change1, change2]);
        expect(result).toEqual({ text: 'B' });
        var reversed1 = _1.reverseChanges(result, [change1, change2]);
        expect(reversed1).toEqual({});
    });
});
//# sourceMappingURL=stateChange.spec.js.map