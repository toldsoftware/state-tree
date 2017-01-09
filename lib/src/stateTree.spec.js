"use strict";
var _1 = require("./");
describe('stateTree with simple state', function () {
    var state = { text: 'A' };
    it('should get value', function () {
        var stateTree = _1.toStateTree(state);
        var result = stateTree.text.value;
        expect(result).toEqual('A');
    });
    it('should notify of get value', function () {
        var stateTree = _1.toStateTree(state);
        var v = stateTree.text.value;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind.setValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });
    it('should observe set value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.text.subscribe(function (x) { return result = x; });
        expect(result).toEqual(null);
        stateTree.text.value = 'B';
        expect(result).toEqual('B');
    });
    it('should observe set value with .value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.text.subscribe(function (x) { return result = x; });
        expect(result).toEqual(null);
        stateTree.text.value = 'B';
        expect(result).toEqual('B');
    });
});
describe('stateTree with nested state', function () {
    var state = { nested: { nested: { text: 'A' } } };
    it('should get value', function () {
        var stateTree = _1.toStateTree(state);
        var result = stateTree.nested.nested.text.value;
        expect(result).toEqual('A');
    });
    it('should notify of get value', function () {
        var stateTree = _1.toStateTree(state);
        var v = stateTree.nested.nested.text.value;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);
        stateTree.nested.nested.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind.setValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });
    it('should observe set value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.nested.nested.text.subscribe(function (x) { return result = x; });
        expect(result).toEqual(null);
        stateTree.nested.nested.text.value = 'B';
        expect(result).toEqual('B');
    });
    it('should reconstruct state tree after state change', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.nested.nested.text.value = 'B';
        var result = stateTree.root.value;
        expect(result).toEqual({ nested: { nested: { text: 'B' } } });
    });
});
//# sourceMappingURL=stateTree.spec.js.map