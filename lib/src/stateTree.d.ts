import { Subscriber, SimpleSubject, Subscription } from './utils';
import { StateData } from './stateData';
export declare type StateNodeType<T> = {
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
export declare function toStateTree<T extends StateData>(stateData: T): StateNodeType<T> & StateTree<T>;
export declare class StateNode<T> extends SimpleSubject<T> {
    private _tree;
    private _parent;
    isArray: boolean;
    private _arraySubscripton;
    private _path;
    private _fullPath;
    path: string;
    readonly fullPath: string;
    constructor(_tree: StateTree<any>, _parent: StateNode<any>, path: string, initialValue: T, isArray: boolean);
    protected getChildrenNames(): string[];
    protected getValue(shouldNotifyTree?: boolean): T;
    value_merge: T;
    protected setValue(newValue: T, shouldRemoveMissing?: boolean, shouldNotifyTree?: boolean): void;
    asArray<U>(): StateNodeType<U>[] & StateNode<U>[];
    asArrayOperators<U>(): ArrayOperators<U>;
    subscribeArray<U>(subscriber: Subscriber<ArrayEventArgs<U>>): number;
    unsubscribeArray(iSubscriber: number): void;
    push(...values: any[]): void;
    insert(iStart: number, ...values: any[]): void;
    removeAt(iStart: number, count?: number): void;
}
export declare class StateTree<T> {
    root: StateNode<T>;
    notifications: StateNotification[];
    subsription: Subscription<StateNotification>;
    constructor();
    subscribe(subscriber: Subscriber<StateNotification>): number;
    unsubscribe(iSubscriber: number): void;
    notify_getValue<U>(stateNodeFullPath: string, value: U): void;
    notify_setValue<U>(stateNodeFullPath: string, value: U, oldValue: U): void;
    notify_addItems<U>(stateNodeFullPath: string, items: U[]): void;
    notify_removeItems<U>(stateNodeFullPath: string, items: U[]): void;
}
export interface StateNotification {
    kind: string;
    stateNodeFullPath: string;
    valueJson: string;
    valueJson_old?: string;
}
export declare enum StateNotificationKind {
    getValue = 0,
    setValue = 1,
    addItems = 2,
    removeItems = 3,
}
