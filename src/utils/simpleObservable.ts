export type Subscriber<T> = (value: T, oldValue: T) => void;

export interface Observable<T> {
    subscribe(subscriber: Subscriber<T>): void;
    unsubscribe(iSubscriber: number): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}

export class SimpleSubject<T> {

    protected _value: T;
    public get value() { return this.getValue(); }
    public set value(newValue: T) { this.setValue(newValue); }
    public getValue() { return this._value; }
    public setValue(v: T) {
        let oldValue = this._value;
        this._value = v;

        for (let x of this._subscribers) {
            if (x) {
                x(v, oldValue);
            }
        }
    }

    private _subscribers: Subscriber<T>[] = [];

    constructor(initialValue: T) {
        this.setValue(initialValue);
    }

    public subscribe(subscriber: Subscriber<T>) {
        let iSubscriber = this._subscribers.push(subscriber) - 1;
        return iSubscriber;
    }

    public unsubscribe(iSubscriber: number) {
        this._subscribers[iSubscriber] = null;
    }

    public emit(t: T) { this.setValue(t); }
}
