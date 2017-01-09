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
        this._fullPath = !this._parent ? this.path : this._parent.fullPath + (this._parent && this._parent._isArray ? `[${this._path}]` : `.${this._path}`);
    }

    get fullPath() { return this._fullPath; }

    constructor(public _tree: StateTree<any>, public _parent: StateNode<any>, path: string, initialValue: T, public _isArray: boolean) {
        super(initialValue);
        this.path = path;
    }

    protected getChildrenNames() {
        let node = this as any;
        let keys = [];

        for (let k in node) {
            if (k[0] !== '_') {
                let prop = Object.getOwnPropertyDescriptor(node, k);
                if (prop != null && prop.get == null) {
                    let child = node[k];
                    if (child != null
                        && child instanceof StateNode
                        && child._parent === node
                    ) {
                        keys.push(k);
                    }
                }
            }
        }

        return keys;
    }

    protected getValue(shouldNotifyTree = true): T {
        // Rebuild value from children values
        let value = this._value;
        if (value != null && typeof value === 'object') {
            let reconstructed = (this._isArray ? [] : {}) as any;

            for (let k of this.getChildrenNames()) {
                let kNode = (this as any)[k];
                if (kNode == null) {
                    let breakdance = true;
                }
                let kValue = kNode.getValue();
                if (kValue != null) {
                    (reconstructed as any)[k] = kValue;
                }
            }

            value = reconstructed;
        }

        if (shouldNotifyTree) { this._tree.notify_getValue(this.fullPath, value); }
        return value;
    }

    set value_merge(newValue: T) {
        this.setValue(newValue, false);
    }

    protected setValue(newValue: T, shouldRemoveMissing = true, shouldNotifyTree = true) {
        let oldValue = this.getValue(false);

        if (newValue === DELETE) { newValue = null; }
        this._value = newValue;

        let node = this as any;

        if (newValue != null) {
            let keys_set: string[] = [];
            for (let k in newValue) {
                let kValue = newValue[k];

                if (!node[k]) {
                    // Create State Nodes for new Properties
                    node[k] = createStateNode(this._tree, node, k, kValue);
                } else {
                    // Set Nested Value
                    node[k].setValue(kValue, shouldRemoveMissing, false);
                }

                keys_set.push(k);
            }

            // Missing keys
            if (shouldRemoveMissing) {
                let keys_missing = this.getChildrenNames().filter(x => keys_set.indexOf(x) < 0);
                for (let k of keys_missing) {
                    node[k].setValue(null, shouldRemoveMissing, false);
                }
            }
        } else {
            if (shouldRemoveMissing) {
                // Pass Null Down Branch
                for (let k of this.getChildrenNames()) {
                    node[k].setValue(null, shouldRemoveMissing, false);
                }
            }
        }

        this.notifySubscribers(newValue, oldValue);
        if (shouldNotifyTree) {
            this._tree.notify_setValue(this.fullPath, newValue, oldValue);
        }
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