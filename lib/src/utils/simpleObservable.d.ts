export declare type Subscriber<T> = (value: T, oldValue: T) => void;
export interface Observable<T> {
    subscribe(subscriber: Subscriber<T>): void;
    unsubscribe(iSubscriber: number): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}
export declare class SimpleSubject<T> implements Subject<T> {
    protected _value: T;
    value: T;
    getValue(): T;
    setValue(v: T): void;
    private _subscribers;
    constructor(initialValue: T);
    subscribe(subscriber: Subscriber<T>): number;
    unsubscribe(iSubscriber: number): void;
    emit(t: T): void;
}
