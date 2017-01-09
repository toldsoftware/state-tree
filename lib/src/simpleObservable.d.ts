export declare type Subscriber<T> = (value: T, oldValue: T) => void;
export interface Observable<T> {
    subscribe(callback: Subscriber<T>): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}
export declare class SimpleObservable<T> {
    private _history;
    readonly history: T[];
    protected _value: T;
    private _subscribers;
    constructor(initialValue: T);
    protected setValue(newValue: T): void;
    subscribe(callback: Subscriber<T>): number;
    unsubscribe(iSubscriber: number): void;
}
export declare class SimpleSubject<T> extends SimpleObservable<T> {
    constructor(initialValue: T);
    value: T;
    emit(t: T): void;
}
