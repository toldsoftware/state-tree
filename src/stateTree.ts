import { Subscriber, SimpleSubject, Observable, Subscription } from './utils';
import { StateData, DELETE } from './stateData';

export type StateNodeType<T> = {
[P in keyof T]: StateNodeType<T[P]> & StateNode<T[P]>;
};

export interface ArrayEventArgs<T> {
    index: number;
    count: number;
    addedItems?: T[];
    removedItems?: T[];
}

export interface ArrayOperators<T> {
    push(...t: T[]): void;
    insert(i: number, ...t: T[]): void;
    removeAt(i: number, count?: number): void;
}

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

    private _arraySubscripton: Subscription<ArrayEventArgs<any>>;

    private _path: string;
    private _fullPath: string;
    get path() { return this._path; }
    set path(v: string) {
        this._path = '' + v;
        this._fullPath = !this._parent ? this.path : this._parent.fullPath + (this._parent && this._parent._isArray ? `[${this._path}]` : `.${this._path}`);
    }

    get fullPath() { return this._fullPath; }

    constructor(private _tree: StateTree<any>, private _parent: StateNode<any>, path: string, initialValue: T, private _isArray: boolean) {
        super(initialValue);
        this.path = path;
        if (_isArray) {
            this._arraySubscripton = new Subscription<ArrayEventArgs<any>>();
        }
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
                let kValue = kNode.getValue(shouldNotifyTree);
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

        this.notifySubscribers({ value: newValue, oldValue });
        if (shouldNotifyTree) {
            this._tree.notify_setValue(this.fullPath, newValue, oldValue);
        }
    }

    // Array 
    asArray<U>(): StateNodeType<U>[] & StateNode<U>[] {
        return this as any;
    }

    asArrayOperators<U>(): ArrayOperators<U> {
        return this as any;
    }

    subscribeArray<U>(subscriber: Subscriber<ArrayEventArgs<U>>) {
        if (!this._isArray) { throw 'this is not an array'; }
        return this._arraySubscripton.subscribe(subscriber);
    }

    unsubscribeArray(iSubscriber: number) {
        if (!this._isArray) { throw 'this is not an array'; }
        return this._arraySubscripton.unsubscribe(iSubscriber);
    }

    push(...values: any[]): void {
        if (!this._isArray) { throw 'this is not an array'; }

        let array = this.getValue(false) as any as any[];
        this.insert(array.length, ...values);
    }

    insert(iStart: number, ...values: any[]): void {
        if (!this._isArray) { throw 'this is not an array'; }

        let node = this as any;
        let array = this.getValue(false) as any as any[];
        let count = values.length;

        // Move any items at or after iStart past end
        let len = array.length;
        for (let i = len - 1; i >= iStart; i--) {
            let iSource = i;
            let iTarget = i + count;
            node[iTarget] = node[iSource];
            node[iTarget].path = iTarget;
        }

        // Insert new items
        for (let i = 0; i < values.length; i++) {
            let iTarget = iStart + i;
            node[iTarget] = createStateNode(this._tree, node, '' + iTarget, values[i]);
        }

        this._arraySubscripton.notifySubscribers({
            index: iStart,
            count: count,
            addedItems: values,
        });
        this._tree.notify_addItems(node[iStart].fullPath, values);

    }

    removeAt(iStart: number, count = 1): void {
        if (!this._isArray) { throw 'this is not an array'; }

        let node = this as any;
        let array = this.getValue(false) as any as any[];
        let removedItems = array.slice(iStart, iStart + count);

        // Delete removed items
        for (let i = 0; i < count; i++) {
            let iTarget = iStart + i;
            node[iTarget].setValue(DELETE, true, false);
        }

        // Move items to iStart
        let len = array.length;
        for (let i = iStart + count; i < len; i++) {
            let iSource = i;
            let iTarget = i - count;
            node[iTarget] = node[iSource];
            node[iTarget].path = iTarget;
            node[iSource] = null;
        }

        this._arraySubscripton.notifySubscribers({
            index: iStart,
            count: count,
            removedItems: removedItems,
        });
        this._tree.notify_removeItems(node[iStart].fullPath, removedItems);
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
            kind: StateNotificationKind[StateNotificationKind.getValue],
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(value),
        });
    }

    notify_setValue<U>(stateNodeFullPath: string, value: U, oldValue: U) {
        this.notifications.push({
            kind: StateNotificationKind[StateNotificationKind.setValue],
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(value),
            valueJson_old: JSON.stringify(oldValue),
        });
    }

    notify_addItems<U>(stateNodeFullPath: string, items: U[]) {
        this.notifications.push({
            kind: StateNotificationKind[StateNotificationKind.addItems],
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(items),
        });
    }

    notify_removeItems<U>(stateNodeFullPath: string, items: U[]) {
        this.notifications.push({
            kind: StateNotificationKind[StateNotificationKind.removeItems],
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(items),
        });
    }
}

export interface StateNotification {
    kind: string;
    stateNodeFullPath: string;
    valueJson: string;
    valueJson_old?: string;
}

export enum StateNotificationKind {
    getValue,
    setValue,
    addItems,
    removeItems,
}