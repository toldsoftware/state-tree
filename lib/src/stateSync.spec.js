"use strict";
var _1 = require("./");
describe('stateSync with simple state', function () {
    var state = { text: 'A' };
    it('should store change', function () {
        var stateTree = _1.toStateTree(state);
        var storage = new _1.MemoryStateStorage();
        var sync = new _1.StateSync(stateTree, storage);
        var before = stateTree.text.value;
        expect(before).toEqual('A');
        expect(storage.changes.length).toEqual(0);
        stateTree.text.value = 'B';
        // console.log(stateTree.notifications);
        // console.log(storage.changes[0]);
        expect(storage.changes.length).toEqual(1);
        expect(JSON.parse(storage.changes[0]).oldStateDelta).toEqual({ text: 'A' });
        expect(JSON.parse(storage.changes[0]).newStateDelta).toEqual({ text: 'B' });
    });
    it('should store multiple changes', function () {
        var stateTree = _1.toStateTree(state);
        var storage = new _1.MemoryStateStorage();
        var sync = new _1.StateSync(stateTree, storage);
        var before = stateTree.text.value;
        expect(before).toEqual('A');
        expect(storage.changes.length).toEqual(0);
        stateTree.text.value = 'B';
        stateTree.text.value = 'C';
        stateTree.text.value = 'D';
        expect(storage.changes.length).toEqual(3);
        expect(JSON.parse(storage.changes[0]).oldStateDelta).toEqual({ text: 'A' });
        expect(JSON.parse(storage.changes[0]).newStateDelta).toEqual({ text: 'B' });
        expect(JSON.parse(storage.changes[1]).oldStateDelta).toEqual({ text: 'B' });
        expect(JSON.parse(storage.changes[1]).newStateDelta).toEqual({ text: 'C' });
        expect(JSON.parse(storage.changes[2]).oldStateDelta).toEqual({ text: 'C' });
        expect(JSON.parse(storage.changes[2]).newStateDelta).toEqual({ text: 'D' });
    });
});
//# sourceMappingURL=stateSync.spec.js.map