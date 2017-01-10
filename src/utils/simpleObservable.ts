export type Subscriber<T> = (args: T) => void;
export type ChangeArgs<T> = { value: T; oldValue?: T }
export type ChangeSubscriber<T> = (args: ChangeArgs<T>) => void;

export interface Observable<T> {
    subscribe(subscriber: ChangeSubscriber<T>): void;
    unsubscribe(iSubscriber: number): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}

export class Subscription<T>{
    private _subscribers: Subscriber<T>[] = [];
    public subscribe(subscriber: Subscriber<T>) {
        let iSubscriber = this._subscribers.push(subscriber) - 1;
        return iSubscriber;
    }

    public unsubscribe(iSubscriber: number) {
        this._subscribers[iSubscriber] = null;
    }

    public notifySubscribers(args: T) {
        for (let x of this._subscribers) {
            if (x) {
                x(args);
            }
        }
    }
}

export class SimpleSubject<T> extends Subscription<ChangeArgs<T>> implements Subject<T> {

    protected _value: T;
    public get value() { return this.getValue(); }
    public set value(newValue: T) { this.setValue(newValue); }
    protected getValue() { return this._value; }
    protected setValue(v: T) {
        let oldValue = this._value;
        this._value = v;
        this.notifySubscribers({ value: v, oldValue });
    }

    constructor(initialValue: T) {
        super();
        this._value = initialValue;
    }

    public emit(t: T) { this.setValue(t); }
}
