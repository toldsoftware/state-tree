import { StateData, DELETE } from './stateData';

export interface StateChange<T extends StateData> {
    uuid: string;
    newStateDelta: T;
    oldStateDelta: T;
    metadata: StateData;
}

export function mergeChanges<T extends StateData>(initialStateData: T, stateChanges: StateChange<T>[]): T {
    let verified: StateChange<T>[] = [];
    let uuids: { [uuid: string]: boolean } = {};

    for (let x of stateChanges) {
        if (uuids[x.uuid]) { continue; }
        verified.push(x);
        uuids[x.uuid] = true;
    }

    return mergeStateData([initialStateData, ...verified.map(x => toChangeWithDelete(x.oldStateDelta, x.newStateDelta))]);
}

export function reverseChanges<T extends StateData>(stateData: T, stateChanges_toReverse: StateChange<T>[]): T {
    let verified: StateChange<T>[] = [];
    let uuids: { [uuid: string]: boolean } = {};

    for (let x of stateChanges_toReverse) {
        if (uuids[x.uuid]) { continue; }
        verified.push(x);
        uuids[x.uuid] = true;
    }

    return mergeStateData([stateData, ...verified.map(x => toChangeWithDelete(x.newStateDelta, x.oldStateDelta)).reverse()]);
}

function toChangeWithDelete<T>(oldState: T, newState: T): T {
    let clone: T = {} as any;
    assignDeep(clone, oldState);
    markDeleteDeep(clone);
    assignDeep(clone, newState);
    return clone;
}

function markDeleteDeep(obj: any) {
    for (let k in obj) {
        if (typeof obj[k] === 'object') {
            markDeleteDeep(obj[k]);
        } else {
            obj[k] = DELETE;
        }
    }
}

export function mergeStateData<T extends StateData>(stateData: T[]): T {
    let result = {} as T;

    for (let x of stateData) {
        assignDeep(result, x);
    }

    return result;
}

function assignDeep<T>(target: T, source: T) {
    if (source == null) { return; }

    for (let k in source) {
        let v = source[k];
        if (v == null) { continue; }

        if (v === DELETE) {
            delete (target[k]);
        } else if (typeof v === 'object') {
            target[k] = target[k] || {} as any;
            assignDeep(target[k], v);
        } else {
            target[k] = v;
        }
    }
}
