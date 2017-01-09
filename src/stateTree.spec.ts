import { toStateTree, StateNotificationKind } from './';

describe('stateTree with simple state', () => {

    let state = { text: 'A' };

    it('should get value', () => {
        let stateTree = toStateTree(state);
        let result = stateTree.text.value;
        expect(result).toEqual('A');
    });

    it('should notify of get value', () => {
        let stateTree = toStateTree(state);
        let v = stateTree.text;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        stateTree.text = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.setValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.text.subscribe(x => result = x);
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

describe('stateTree with nested state', () => {

    let state = { nested: { nested: { text: 'A' } } };

    it('should get value', () => {
        let stateTree = toStateTree(state);
        let result = stateTree.nested.nested.text.value;
        expect(result).toEqual('A');
    });

    it('should notify of get value', () => {
        let stateTree = toStateTree(state);
        let v = stateTree.nested.nested.text;
        // expect(stateTree.notifications.length).toEqual(3);
        expect(stateTree.notifications[2].kind).toEqual(StateNotificationKind.getValue);
        expect(stateTree.notifications[2].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[2].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);
        stateTree.nested.nested.text = 'B';
        console.log(stateTree.notifications);
        let len = stateTree.notifications.length;
        // expect(stateTree.notifications.length).toEqual(3);
        expect(stateTree.notifications[len - 1].kind).toEqual(StateNotificationKind.setValue);
        expect(stateTree.notifications[len - 1].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[len - 1].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[len - 1].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.nested.nested.text.subscribe(x => result = x);
        expect(result).toEqual(null);
        stateTree.nested.nested.text = 'B';
        expect(result).toEqual('B');
    });

    it('should reconstruct state tree after state change', () => {
        let stateTree = toStateTree(state);
        stateTree.nested.nested.text = 'B';
        let result = stateTree.value;
        expect(result).toEqual({ nested: { nested: { text: 'B' } } });
    });

});
