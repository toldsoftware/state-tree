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
        var v = stateTree.text;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.text = 'B';
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
        stateTree.text = 'B';
        expect(result).toEqual('B');
    });
    // it('should observe set value with .value', () => {
    //     let stateTree = toStateTree(state);
    //     let result = null;
    //     stateTree.text.subscribe(x => result = x);
    //     expect(result).toEqual(null);
    //     stateTree.text.value = 'B';
    //     expect(result).toEqual('B');
    // });
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
        var v = stateTree.nested.nested.text;
        expect(stateTree.notifications.length).toEqual(3);
        expect(stateTree.notifications[2].kind).toEqual(_1.StateNotificationKind.getValue);
        expect(stateTree.notifications[2].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[2].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.nested.nested.text = 'B';
        expect(stateTree.notifications.length).toEqual(3);
        expect(stateTree.notifications[2].kind).toEqual(_1.StateNotificationKind.setValue);
        expect(stateTree.notifications[2].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[2].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[2].valueJson_old).toEqual(JSON.stringify('A'));
    });
    it('should observe set value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.nested.nested.text.subscribe(function (x) { return result = x; });
        expect(result).toEqual(null);
        stateTree.nested.nested.text = 'B';
        expect(result).toEqual('B');
    });
});
//# sourceMappingURL=stateTree.spec.js.map