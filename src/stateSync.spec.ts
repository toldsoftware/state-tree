import { StateSync, StateChange, MemoryStateStorage, toStateTree } from './';

describe('stateSync with simple state', () => {

    let state = { text: 'A' };
    type T = typeof state;

    it('should store change', () => {
        let stateTree = toStateTree(state);
        let storage = new MemoryStateStorage();
        let sync = new StateSync(stateTree, storage);

        let before = stateTree.text.value;
        expect(before).toEqual('A');
        expect(storage.changes.length).toEqual(0);

        stateTree.text.value = 'B';
        // console.log(stateTree.notifications);
        // console.log(storage.changes[0]);

        expect(storage.changes.length).toEqual(1);
        expect((JSON.parse(storage.changes[0]) as StateChange<T>).oldStateDelta).toEqual({ text: 'A' });
        expect((JSON.parse(storage.changes[0]) as StateChange<T>).newStateDelta).toEqual({ text: 'B' });

    });

    it('should store multiple changes', () => {
        let stateTree = toStateTree(state);
        let storage = new MemoryStateStorage();
        let sync = new StateSync(stateTree, storage);

        let before = stateTree.text.value;
        expect(before).toEqual('A');
        expect(storage.changes.length).toEqual(0);

        stateTree.text.value = 'B';
        stateTree.text.value = 'C';
        stateTree.text.value = 'D';

        expect(storage.changes.length).toEqual(3);
        expect((JSON.parse(storage.changes[0]) as StateChange<T>).oldStateDelta).toEqual({ text: 'A' });
        expect((JSON.parse(storage.changes[0]) as StateChange<T>).newStateDelta).toEqual({ text: 'B' });
        expect((JSON.parse(storage.changes[1]) as StateChange<T>).oldStateDelta).toEqual({ text: 'B' });
        expect((JSON.parse(storage.changes[1]) as StateChange<T>).newStateDelta).toEqual({ text: 'C' });
        expect((JSON.parse(storage.changes[2]) as StateChange<T>).oldStateDelta).toEqual({ text: 'C' });
        expect((JSON.parse(storage.changes[2]) as StateChange<T>).newStateDelta).toEqual({ text: 'D' });

    });

});
