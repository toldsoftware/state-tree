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
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.getValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.setValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });
    it('should observe set value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.text.subscribe(function (x) { return result = x.value; });
        expect(result).toEqual(null);
        stateTree.text.value = 'B';
        expect(result).toEqual('B');
    });
    it('should observe set value with .value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.text.subscribe(function (x) { return result = x.value; });
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
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.getValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);
        stateTree.nested.nested.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.setValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });
    it('should observe set value', function () {
        var stateTree = _1.toStateTree(state);
        var result = null;
        stateTree.nested.nested.text.subscribe(function (x) { return result = x.value; });
        expect(result).toEqual(null);
        stateTree.nested.nested.text.value = 'B';
        expect(result).toEqual('B');
    });
    it('should reconstruct state tree', function () {
        var stateTree = _1.toStateTree(state);
        var result = stateTree.root.value;
        expect(result).toEqual({ nested: { nested: { text: 'A' } } });
    });
    it('should reconstruct state tree after state change', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.nested.nested.text.value = 'B';
        var result = stateTree.root.value;
        expect(result).toEqual({ nested: { nested: { text: 'B' } } });
    });
    it('should handle null of state structure', function () {
        var stateTree = _1.toStateTree(state);
        var before = stateTree.root.value;
        expect(before).toEqual({
            nested: {
                nested: {
                    text: 'A'
                }
            }
        });
        stateTree.nested.nested.text.value = null;
        var result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nested: {}
            }
        });
    });
    it('should handle DELETE of state structure', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.nested.nested.text.value = _1.DELETE;
        var result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nested: {}
            }
        });
    });
    it('should reconstruct state tree after state structure replaced', function () {
        var stateTree = _1.toStateTree(state);
        var before = stateTree.root.value;
        expect(before).toEqual({
            nested: {
                nested: {
                    text: 'A'
                }
            }
        });
        stateTree.nested.value = { nestedB: { text: 'B' } };
        var result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nestedB: {
                    text: 'B'
                }
            }
        });
    });
    it('should reconstruct state tree after state structure merged', function () {
        var stateTree = _1.toStateTree(state);
        var before = stateTree.root.value;
        expect(before).toEqual({
            nested: {
                nested: {
                    text: 'A'
                }
            }
        });
        stateTree.nested.value_merge = { nestedB: { text: 'B' } };
        var result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nested: {
                    text: 'A'
                },
                nestedB: {
                    text: 'B'
                }
            }
        });
    });
});
describe('stateTree with array', function () {
    var state = {
        items: [
            { text: 'A' },
            { text: 'B' },
            { text: 'C' },
        ]
    };
    it('should get value', function () {
        var stateTree = _1.toStateTree(state);
        var result = stateTree.items.asArray()[0].text.value;
        expect(result).toEqual('A');
    });
    it('should notify of get value', function () {
        var stateTree = _1.toStateTree(state);
        var v = stateTree.items.asArray()[0].text.value;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.getValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[0].text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });
    it('should notify of set value', function () {
        var stateTree = _1.toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);
        stateTree.items.asArray()[0].text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.setValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[0].text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });
    it('should observe set value', function () {
        var stateTree = _1.toStateTree(state);
        var n = null;
        stateTree.items.asArray()[0].text.subscribe(function (x) { return n = x.value; });
        expect(n).toEqual(null);
        stateTree.items.asArray()[0].text.value = 'B';
        expect(n).toEqual('B');
    });
    it('should reconstruct state tree after state change', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.items.asArray()[0].text.value = 'B';
        var result = stateTree.root.value;
        expect(result).toEqual({
            items: [
                { text: 'B' },
                { text: 'B' },
                { text: 'C' },
            ]
        });
    });
    it('should support array push', function () {
        var stateTree = _1.toStateTree(state);
        var before = stateTree.root.value;
        expect(before).toEqual({
            items: [
                { text: 'A' },
                { text: 'B' },
                { text: 'C' },
            ]
        });
        stateTree.items.asArrayOperators().push({ text: 'D' });
        var result = stateTree.root.value;
        expect(result).toEqual({
            items: [
                { text: 'A' },
                { text: 'B' },
                { text: 'C' },
                { text: 'D' },
            ]
        });
    });
    it('should notify tree on array push', function () {
        var stateTree = _1.toStateTree(state);
        stateTree.items.asArrayOperators().push({ text: 'D' });
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.addItems]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[3]');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify([{ text: 'D' }]));
    });
    it('should notify subscriber on array push', function () {
        var stateTree = _1.toStateTree(state);
        var n = null;
        stateTree.items.subscribeArray(function (x) { return n = x; });
        stateTree.items.asArrayOperators().push({ text: 'D' });
        expect(n.addedItems).toEqual([{ text: 'D' }]);
    });
    it('should have correct paths and values after array insert', function () {
        var stateTree = _1.toStateTree(state);
        var n = null;
        stateTree.items.subscribeArray(function (x) { return n = x; });
        stateTree.items.asArrayOperators().insert(1, { text: 'AA' });
        expect(stateTree.items.asArray()[0].fullPath).toEqual('.items[0]');
        expect(stateTree.items.asArray()[1].fullPath).toEqual('.items[1]');
        expect(stateTree.items.asArray()[2].fullPath).toEqual('.items[2]');
        expect(stateTree.items.asArray()[3].fullPath).toEqual('.items[3]');
        expect(stateTree.items.asArray()[0].text.value).toEqual('A');
        expect(stateTree.items.asArray()[1].text.value).toEqual('AA');
        expect(stateTree.items.asArray()[2].text.value).toEqual('B');
        expect(stateTree.items.asArray()[3].text.value).toEqual('C');
    });
    it('should notify on array insert', function () {
        var stateTree = _1.toStateTree(state);
        var n = null;
        stateTree.items.subscribeArray(function (x) { return n = x; });
        stateTree.items.asArrayOperators().insert(1, { text: 'AA' });
        expect(n.addedItems).toEqual([{ text: 'AA' }]);
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.addItems]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[1]');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify([{ text: 'AA' }]));
    });
    it('should have correct paths and values after array remove', function () {
        var stateTree = _1.toStateTree(state);
        var n = null;
        stateTree.items.subscribeArray(function (x) { return n = x; });
        stateTree.items.asArrayOperators().removeAt(1);
        expect(stateTree.items.asArray()[0].fullPath).toEqual('.items[0]');
        expect(stateTree.items.asArray()[1].fullPath).toEqual('.items[1]');
        expect(stateTree.items.asArray()[2]).toBeNull();
        expect(stateTree.items.asArray()[0].text.value).toEqual('A');
        expect(stateTree.items.asArray()[1].text.value).toEqual('C');
    });
    it('should notify on array remove', function () {
        var stateTree = _1.toStateTree(state);
        var n = null;
        stateTree.items.subscribeArray(function (x) { return n = x; });
        stateTree.items.asArrayOperators().removeAt(1);
        expect(n.removedItems).toEqual([{ text: 'B' }]);
        // console.log(stateTree.notifications);
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(_1.StateNotificationKind[_1.StateNotificationKind.removeItems]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[1]');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify([{ text: 'B' }]));
    });
});
//# sourceMappingURL=stateTree.spec.js.map