"use strict";
var _1 = require("./");
describe('mergeChanges with simple state', function () {
    var state = { text: 'A' };
    var change = { text: 'B' };
    it('should have merged result', function () {
        var result = _1.mergeChanges([state, change]);
        expect(result).toEqual({ text: 'B' });
    });
});
describe('mergeChanges with 2 level state', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var change = { text: 'B', nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeChanges([state, change]);
        expect(result).toEqual({ text: 'B', nested: { text: 'B' } });
    });
});
describe('mergeChanges with missing values', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var change = { nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeChanges([state, change]);
        expect(result).toEqual({ text: 'A', nested: { text: 'B' } });
    });
});
describe('mergeChanges with added values', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var change = { newItem: 'B', nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeChanges([state, change]);
        expect(result).toEqual({ text: 'A', newItem: 'B', nested: { text: 'B' } });
    });
});
describe('mergeChanges with DELETE values', function () {
    var state = { text: 'A', nested: { text: 'A' } };
    var change = { text: _1.DELETE, nested: { text: 'B' } };
    it('should have merged result', function () {
        var result = _1.mergeChanges([state, change]);
        expect(result).toEqual({ nested: { text: 'B' } });
    });
});
describe('mergeChanges with multiple changes', function () {
    var state = { text: 'A', nested: { text: 'A', nested2: { text: 'A' } } };
    var change = { nested: { nested2: { text: 'B' } } };
    var change2 = { nested: { nested2: { newText: 'C' } } };
    var change3 = { nested: { nested2: { nested3: { text: 'D' } } } };
    it('should have merged result', function () {
        var result = _1.mergeChanges([state, change, change2, change3]);
        expect(result).toEqual({ text: 'A', nested: { text: 'A', nested2: { text: 'B', newText: 'C', nested3: { text: 'D' } } } });
    });
});
//# sourceMappingURL=stateSnapshot.spec.js.map