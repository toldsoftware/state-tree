import { toStateTree, StateNotificationKind, DELETE, ArrayEventArgs } from './';

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
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.getValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        stateTree.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.setValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.text.subscribe(x => result = x.value);
        expect(result).toEqual(null);
        stateTree.text.value = 'B';
        expect(result).toEqual('B');
    });

    it('should observe set value with .value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.text.subscribe(x => result = x.value);
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
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.getValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);

        stateTree.nested.nested.text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.setValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.nested.nested.text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let result = null;
        stateTree.nested.nested.text.subscribe(x => result = x.value);
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
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.getValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[0].text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('A'));
    });

    it('should notify of set value', () => {
        let stateTree = toStateTree(state);
        expect(stateTree.notifications.length).toEqual(0);

        stateTree.items.asArray<Item>()[0].text.value = 'B';
        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.setValue]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[0].text');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify('B'));
        expect(stateTree.notifications[0].valueJson_old).toEqual(JSON.stringify('A'));
    });

    it('should observe set value', () => {
        let stateTree = toStateTree(state);
        let n = null;
        stateTree.items.asArray<Item>()[0].text.subscribe(x => n = x.value);
        expect(n).toEqual(null);
        stateTree.items.asArray<Item>()[0].text.value = 'B';
        expect(n).toEqual('B');
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

    it('should support array push', () => {
        let stateTree = toStateTree(state);
        let before = stateTree.root.value;
        expect(before).toEqual({
            items: [
                { text: 'A' },
                { text: 'B' },
                { text: 'C' },
            ]
        });

        stateTree.items.asArrayOperators<Item>().push({ text: 'D' });
        let result = stateTree.root.value;
        expect(result).toEqual({
            items: [
                { text: 'A' },
                { text: 'B' },
                { text: 'C' },
                { text: 'D' },
            ]
        });
    });

    it('should notify tree on array push', () => {
        let stateTree = toStateTree(state);
        stateTree.items.asArrayOperators<Item>().push({ text: 'D' });

        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.addItems]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[3]');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify([{ text: 'D' }]));
    });

    it('should notify subscriber on array push', () => {
        let stateTree = toStateTree(state);

        let n: ArrayEventArgs<any> = null;
        stateTree.items.subscribeArray(x => n = x);
        stateTree.items.asArrayOperators<Item>().push({ text: 'D' });

        expect(n.addedItems).toEqual([{ text: 'D' }]);
    });

    it('should have correct paths and values after array insert', () => {
        let stateTree = toStateTree(state);

        let n: ArrayEventArgs<any> = null;
        stateTree.items.subscribeArray(x => n = x);
        stateTree.items.asArrayOperators<Item>().insert(1, { text: 'AA' });

        expect(stateTree.items.asArray<Item>()[0].fullPath).toEqual('.items[0]');
        expect(stateTree.items.asArray<Item>()[1].fullPath).toEqual('.items[1]');
        expect(stateTree.items.asArray<Item>()[2].fullPath).toEqual('.items[2]');
        expect(stateTree.items.asArray<Item>()[3].fullPath).toEqual('.items[3]');

        expect(stateTree.items.asArray<Item>()[0].text.value).toEqual('A');
        expect(stateTree.items.asArray<Item>()[1].text.value).toEqual('AA');
        expect(stateTree.items.asArray<Item>()[2].text.value).toEqual('B');
        expect(stateTree.items.asArray<Item>()[3].text.value).toEqual('C');
    });

    it('should notify on array insert', () => {
        let stateTree = toStateTree(state);

        let n: ArrayEventArgs<any> = null;
        stateTree.items.subscribeArray(x => n = x);
        stateTree.items.asArrayOperators<Item>().insert(1, { text: 'AA' });

        expect(n.addedItems).toEqual([{ text: 'AA' }]);

        expect(stateTree.notifications.length).toEqual(1);
        expect(stateTree.notifications[0].kind).toEqual(StateNotificationKind[StateNotificationKind.addItems]);
        expect(stateTree.notifications[0].stateNodeFullPath).toEqual('.items[1]');
        expect(stateTree.notifications[0].valueJson).toEqual(JSON.stringify([{ text: 'AA' }]));
    });

});
