export declare type Subscriber<T> = (args: T) => void;
export declare type ChangeArgs<T> = {
    value: T;
    oldValue?: T;
};
export declare type ChangeSubscriber<T> = (args: ChangeArgs<T>) => void;
export interface Observable<T> {
    subscribe(subscriber: ChangeSubscriber<T>): void;
    unsubscribe(iSubscriber: number): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}
export declare class Subscription<T> {
    private _subscribers;
    subscribe(subscriber: Subscriber<T>): number;
    unsubscribe(iSubscriber: number): void;
    notifySubscribers(args: T): void;
}
export declare class SimpleSubject<T> extends Subscription<ChangeArgs<T>> implements Subject<T> {
    protected _value: T;
    value: T;
    protected getValue(): T;
    protected setValue(v: T): void;
    constructor(initialValue: T);
    emit(t: T): void;
}
