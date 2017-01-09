import { SimpleSubject } from './utils';
import { StateData } from './stateData';
export declare type StateNodeType<T> = {
    [P in keyof T]: StateNodeType<T[P]> & StateNode<T[P]>;
};
export declare function toStateTree<T extends StateData>(stateData: T): StateNodeType<T> & StateTree<T>;
export declare class StateNode<T> extends SimpleSubject<T> {
    tree: StateTree<any>;
    parent: StateNode<any>;
    isArray: boolean;
    _path: string;
    _fullPath: string;
    path: string;
    readonly fullPath: string;
    constructor(tree: StateTree<any>, parent: StateNode<any>, path: string, initialValue: T, isArray: boolean);
    protected getValue(shouldSkipLog?: boolean): T;
    protected setValue(newValue: T): void;
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
