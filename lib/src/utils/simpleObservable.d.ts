export declare type Subscriber<T> = (value: T, oldValue: T) => void;
export interface Observable<T> {
    subscribe(subscriber: Subscriber<T>): void;
    unsubscribe(iSubscriber: number): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}
export declare class SimpleObservable<T> {
    protected _value: T;
    getValue(): T;
    private _subscribers;
    constructor(initialValue: T);
    protected setValue(newValue: T): void;
    subscribe(subscriber: Subscriber<T>): number;
    unsubscribe(iSubscriber: number): void;
}
export declare class SimpleSubject<T> extends SimpleObservable<T> {
    constructor(initialValue: T);
    emit(t: T): void;
}
