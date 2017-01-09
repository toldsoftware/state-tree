import { Subscriber, SimpleSubject } from './utils';
import { StateData } from './stateData';
export declare type StateNodeType<T> = {
    [P in keyof T]: StateNodeType<T[P]> & {
        value?: T;
        subscribe?(subscriber: Subscriber<T>): void;
        unsubscribe?(iSubscriber: number): void;
    };
};
export declare function toStateTree<T extends StateData>(stateData: T): StateNodeType<T> & StateTree;
export declare class StateNode extends SimpleSubject<any> {
    parent: StateNode;
    path: string;
    fullPath: string;
    constructor(parent: StateNode, path: string, initialValue: any);
}
export declare class StateTree extends StateNode {
    notifications: StateNotification[];
    constructor(initialValue?: any);
    notify_getValue(stateNode: StateNode): void;
    notify_setValue(stateNode: StateNode, value: any): void;
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
