"use strict";
var _1 = require("./");
describe('stateTree with simple state', function () {
    var state = { text: 'A' };
    it('should get value', function () {
        var stateTree = _1.toStateTree(state);
        var result = stateTree.text;
        expect(result).toEqual('A');
    });
    // it('should notify of get value', () => {
    //     let stateTree = toStateTree(state);
    //     let v = stateTree.text;
    //     expect(stateTree.notifications.length).toEqual(1);
    //     expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.getValue);
    //     expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
    //     expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    // });
    // it('should notify of set value', () => {
    //     let stateTree = toStateTree(state);
    //     stateTree.text = 'B';
    //     expect(stateTree.notifications.length).toEqual(1);
    //     expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.setValue);
    //     expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
    //     expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
    //     expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    // });
    // it('should observe set value', () => {
    //     let stateTree = toStateTree(state);
    //     let result = null;
    //     stateTree.text.subscribe(x => result = x);
    //     expect(result).toEqual(null);
    //     stateTree.text = 'B';
    //     expect(result).toEqual('B');
    // });
});
//# sourceMappingURL=stateTree.spec.js.map