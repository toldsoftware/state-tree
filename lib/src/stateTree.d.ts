import { SimpleSubject } from './utils';
import { StateData } from './stateData';
export declare type StateNodeType<T> = {
    [P in keyof T]: StateNodeType<T[P]> & StateNode<T[P]>;
};
export declare function toStateTree<T extends StateData>(stateData: T): StateNodeType<T> & StateTree<T>;
export declare class StateNode<T> extends SimpleSubject<T> {
    _tree: StateTree<any>;
    _parent: StateNode<any>;
    _isArray: boolean;
    _path: string;
    _fullPath: string;
    path: string;
    readonly fullPath: string;
    constructor(_tree: StateTree<any>, _parent: StateNode<any>, path: string, initialValue: T, _isArray: boolean);
    protected getChildrenNames(): string[];
    protected getValue(shouldNotifyTree?: boolean): T;
    value_merge: T;
    protected setValue(newValue: T, shouldRemoveMissing?: boolean, shouldNotifyTree?: boolean): void;
    asArray<U>(): StateNodeType<U>[];
}
export declare class StateTree<T> {
    root: StateNode<T>;
    notifications: StateNotification[];
    constructor();
    notify_getValue<U>(stateNodeFullPath: string, value: U): void;
    notify_setValue<U>(stateNodeFullPath: string, value: U, oldValue: U): void;
}
export interface StateNotification {
    kind: StateNotificationKind;
    stateNodeFullPath: string;
    valueJson: string;
    valueJson_old?: string;
}
export declare enum StateNotificationKind {
    getValue = 0,
    setValue = 1,
}
