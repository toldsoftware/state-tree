import { toStateTree, StateNotificationKind, DELETE } from './';

describe('stateTree with simple state', () => {

    let state = { text: 'A' };

    it('should get value', () => {
        let stateTree = toStateTree(state);
        let result = stateTree.text.value;
        expect(result).toEqual('A');
    });

    it('should notify of get value', () => {
        let stateTree = toStateTree(state);
        let v = stateTree.text.value;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        stateTree.text.value = 'B';
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
        stateTree.text.value = 'B';
        expect(result).toEqual('B');
    });

    it('should observe set value with .value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.text.subscribe(x => result = x);
        expect(result).toEqual(null);
        stateTree.text.value = 'B';
        expect(result).toEqual('B');
    });

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
        let v = stateTree.nested.nested.text.value;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);

        stateTree.nested.nested.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.setValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.nested.nested.text.subscribe(x => result = x);
        expect(result).toEqual(null);
        stateTree.nested.nested.text.value = 'B';
        expect(result).toEqual('B');
    });

    it('should reconstruct state tree', () => {
        let stateTree = toStateTree(state);
        let result = stateTree.root.value;
        expect(result).toEqual({ nested: { nested: { text: 'A' } } });
    });

    it('should reconstruct state tree after state change', () => {
        let stateTree = toStateTree(state);
        stateTree.nested.nested.text.value = 'B';
        let result = stateTree.root.value;
        expect(result).toEqual({ nested: { nested: { text: 'B' } } });
    });

    it('should handle null of state structure', () => {
        let stateTree = toStateTree(state);
        let before = stateTree.root.value;
        expect(before).toEqual({
            nested: {
                nested: {
                    text: 'A'
                }
            }
        });

        stateTree.nested.nested.text.value = null;
        let result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nested: {
                }
            }
        });
    });

    it('should handle DELETE of state structure', () => {
        let stateTree = toStateTree(state);
        stateTree.nested.nested.text.value = DELETE;
        let result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nested: {
                }
            }
        });
    });

    it('should reconstruct state tree after state structure replaced', () => {
        let stateTree = toStateTree(state);
        let before = stateTree.root.value;
        expect(before).toEqual({
            nested: {
                nested: {
                    text: 'A'
                }
            }
        });

        stateTree.nested.value = { nestedB: { text: 'B' } } as any;
        let result = stateTree.root.value;
        expect(result).toEqual({
            nested: {
                nestedB: {
                    text: 'B'
                }
            }
        });
    });

    it('should reconstruct state tree after state structure merged', () => {
        let stateTree = toStateTree(state);
        let before = stateTree.root.value;
        expect(before).toEqual({
            nested: {
                nested: {
                    text: 'A'
                }
            }
        });

        stateTree.nested.value_merge = { nestedB: { text: 'B' } } as any;
        let result = stateTree.root.value;
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



describe('stateTree with array', () => {

    let state = {
        items: [
            { text: 'A' },
            { text: 'B' },
            { text: 'C' },
        ]
    };

    type Item = typeof state.items[0];

    it('should get value', () => {
        let stateTree = toStateTree(state);
        let result = stateTree.items.asArray<Item>()[0].text.value;
        expect(result).toEqual('A');
    });

    it('should notify of get value', () => {
        let stateTree = toStateTree(state);
        let v = stateTree.items.asArray<Item>()[0].text.value;
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.getValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[0].text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);

        stateTree.items.asArray<Item>()[0].text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind.setValue);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[0].text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.items.asArray<Item>()[0].text.subscribe(x => result = x);
        expect(result).toEqual(null);
        stateTree.items.asArray<Item>()[0].text.value = 'B';
        expect(result).toEqual('B');
    });

    it('should reconstruct state tree after state change', () => {
        let stateTree = toStateTree(state);
        stateTree.items.asArray<Item>()[0].text.value = 'B';
        let result = stateTree.root.value;
        expect(result).toEqual({
            items: [
                { text: 'B' },
                { text: 'B' },
                { text: 'C' },
            ]
        });
    });

});
