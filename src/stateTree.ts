import { Subscriber, SimpleSubject, Observable } from './utils';
import { StateData, DELETE } from './stateData';

export type StateNodeType<T> = {
[P in keyof T]: StateNodeType<T[P]> & StateNode<T[P]>;
};

// let test = { text: 'A', nested: { text: 'A', nested: { text: 'B' } } };
// let testResult = toStateTree(test);
// let t1 = testResult.nested.nested.text.value;

export function toStateTree<T extends StateData>(stateData: T): StateNodeType<T> & StateTree<T> {
    // Swap the raw object with get/set properties
    let tree = new StateTree();
    let root = createStateNode(tree, null, '', stateData);
    for (let k in stateData) {
        (tree as any)[k] = (root as any)[k];
    }
    tree.root = root;
    return tree as any;
}

function createStateNode<T>(tree: StateTree<any>, parent: StateNode<any>, path: string, source: T) {
    let node = new StateNode(tree, parent, path, source, source instanceof Array);

    if (typeof source === 'object') {
        for (let k in source) {
            (node as any)[k] = createStateNode(tree, node, k, source[k]);
        }
    }

    return node;
}

export class StateNode<T> extends SimpleSubject<T> {
    _path: string;
    _fullPath: string;
    get path() { return this._path; }
    set path(v: string) {
        this._path = v;
        this._fullPath = !this.parent ? this.path : this.parent.fullPath + (this.parent && this.parent.isArray ? `[${this._path}]` : `.${this._path}`);
    }

    get fullPath() { return this._fullPath; }

    constructor(public tree: StateTree<any>, public parent: StateNode<any>, path: string, initialValue: T, public isArray: boolean) {
        super(initialValue);
        this.path = path;
    }

    protected getValue(shouldSkipLog = false): T {
        // Rebuild value from children values
        let value = this._value;
        if (typeof value === 'object') {
            let reconstructed = (this.isArray ? [] : {}) as any;

            for (let k in value) {
                (reconstructed as any)[k] = (this as any)[k].getValue();
            }

            value = reconstructed;
        }

        if (!shouldSkipLog) { this.tree.notify_getValue(this.fullPath, value); }
        return value;
    }

    protected setValue(newValue: T) {
        let oldValue = this.getValue(true);

        if (newValue === DELETE) { newValue = null; }

        this._value = newValue;

        let tree = this.tree;
        let node = this as any;

        if (newValue != null) {
            for (let k in newValue) {
                let kValue = newValue[k];

                if (!node[k]) {
                    // Create State Nodes for new Properties
                    node[k] = createStateNode(tree, node, k, kValue);
                } else {
                    // Set Nested Value
                    node[k].setValue(kValue);
                }
            }
        } else {
            // Pass Null Down Branch
            for (let k in node) {
                if (node[k] instanceof StateNode) {
                    node[k].setValue(null);
                }
            }
        }

        this.notifySubscribers(newValue, oldValue);
        this.tree.notify_setValue(this.fullPath, newValue, oldValue);
    }

    asArray<U>(): StateNodeType<U>[] {
        return this as any;
    }

}

// export class StateNodeArray<T extends any[]>{

// }

export class StateTree<T> {

    root: StateNode<T>;
    notifications: StateNotification[] = [];

    constructor() {
    }

    notify_getValue<U>(stateNodeFullPath: string, value: U) {
        this.notifications.push({
            kind: StateNotificationKind.getValue,
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(value),
        });
    }

    notify_setValue<U>(stateNodeFullPath: string, value: U, oldValue: U) {
        this.notifications.push({
            kind: StateNotificationKind.setValue,
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(value),
            valueJson_old: JSON.stringify(oldValue),
        });
    }
}

export interface StateNotification {
    kind: StateNotificationKind;
    stateNodeFullPath: string;
    valueJson: string;
    valueJson_old?: string;
}

export enum StateNotificationKind {
    getValue,
    setValue,
}