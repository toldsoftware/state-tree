import { Subscriber, SimpleSubject, Observable } from './utils';
import { StateData, DELETE } from './stateData';

export type StateNodeType<T> = {
[P in keyof T]: StateNodeType<T[P]> & {
    value?: T;
    subscribe?(subscriber: Subscriber<T>): void;
    unsubscribe?(iSubscriber: number): void;
};
};

// let test = { text: 'A', nested: { text: 'A', nested: { text: 'B' } } };
// let testResult = toStateTree(test);
// let t1 = testResult.nested.nested.text;

export function toStateTree<T extends StateData>(stateData: T): StateNodeType<T> & StateTree {
    // Swap the raw object with get/set properties
    let tree = new StateTree(stateData);
    return toStateNode(tree, '', tree, stateData);
}

function toStateNode(tree: StateTree, path: string, target: any, source: any) {
    for (let k in source) {
        let v = source[k];
        let kNode = new StateNode(target, k, v);
        if (typeof v === 'object') {
            toProperty(tree, target, k, toStateNode(tree, k, kNode, v));
        } else {
            toProperty(tree, target, k, kNode);
        }
    }

    return target;
}

function toProperty(tree: StateTree, host: StateNode, name: string, value: StateNode) {
    addProperty(host, name, () => {
        tree.notify_getValue(value);
        // let val = value.getValue();
        // if (val['subscribe'] == null) {
        //     val['subscribe'] = value.subscribe;
        //     val['unsubscribe'] = value.unsubscribe;
        // }
        // return val;
        return value as any;
    }, v => {
        tree.notify_setValue(value, v);
        value.setValue(v);
        if (v != null) {
            for (let k in v) {
                if (!(value as any)[k] && v[k] !== DELETE) {
                    // Handle Added Properties
                    toProperty(tree, value, k, new StateNode(value, k, v[k]));
                } else if (v[k] === DELETE) {
                    // Handle DELETE value
                    (value as any)[k] = null;
                } else {
                    // Set Nested Value
                    (value as any)[k] = v[k];
                }
            }
        } else {
            // Pass Null Down Branch
            for (let k in value) {
                if ((value as any)[k] instanceof StateNode) {
                    (value as any)[k] = null;
                }
            }
        }
    });
}

function addProperty<T>(obj: any, name: string, getValue: () => T, setValue: (t: T) => void) {
    Object.defineProperty(obj, name, {
        get: function () { return getValue(); },
        set: function (v: T) { setValue(v); },
        enumerable: true,
        configurable: true
    });
}

// function assign(target: any, source: any) {
//     for (let k in source) {
//         target[k] = source[k];
//     }

//     return target;
// }

// export class StateNode implements Observable<any> {
//     private _value = new SimpleSubject<any>(null);
//     getValue() {
//         return this._value.getValue();
//     };
//     setValue(v: any) {
//         this._value.emit(v);
//     }

//     fullPath: string;

//     constructor(public parent: StateNode, public path: string, initialValue: any) {
//         this.setValue(initialValue);
//         this.fullPath = !this.parent ? this.path : this.parent.fullPath + '.' + this.path;
//     }

//     subscribe(subscriber: Subscriber<any>) {
//         return this._value.subscribe(subscriber);
//     }
//     unsubscribe(iSubscriber: number) {
//         return this._value.unsubscribe(iSubscriber);
//     }
// }

export class StateNode extends SimpleSubject<any> {
    fullPath: string;
    constructor(public parent: StateNode, public path: string, initialValue: any) {
        super(initialValue);
        this.fullPath = !this.parent ? this.path : this.parent.fullPath + '.' + this.path;
    }

    getValue() {
        // Rebuild value from children values
        let value = super.getValue();
        if (typeof value !== 'object') {
            return value;
        }

        let r = {};

        for (let k in value) {
            (r as any)[k] = (this as any)[k].getValue();
        }

        return r;
    }
}

export class StateTree extends StateNode {

    notifications: StateNotification[] = [];

    constructor(initialValue: any = null) {
        super(null, '', initialValue);
    }

    notify_getValue(stateNode: StateNode) {
        this.notifications.push({
            kind: StateNotificationKind.getValue,
            stateNodeFullPath: stateNode.fullPath,
            valueJson: JSON.stringify(stateNode.getValue()),
        });
    }

    notify_setValue(stateNode: StateNode, value: any) {
        this.notifications.push({
            kind: StateNotificationKind.setValue,
            stateNodeFullPath: stateNode.fullPath,
            valueJson_old: JSON.stringify(stateNode.getValue()),
            valueJson: JSON.stringify(value),
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