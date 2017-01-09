import { StateData, DELETE } from './stateData';

export function mergeChanges<T extends StateData>(changes: T[]): T {
    let result = {} as T;

    for (let x of changes) {
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