export type Subscriber<T> = (value: T, oldValue: T) => void;
export interface Observable<T> {
    subscribe(callback: Subscriber<T>): void;
}
export interface Subject<T> extends Observable<T> {
    emit(newValue: T): void;
}

export class SimpleObservable<T> {

    protected _value: T;
    public get value() { return this._value; }

    private _subscribers: Subscriber<T>[] = [];

    constructor(initialValue: T) {
        this.setValue(initialValue);
    }

    protected setValue(newValue: T) {
        let oldValue = this._value;
        this._value = newValue;

        for (let x of this._subscribers) {
            if (x) {
                x(newValue, oldValue);
            }
        }
    }

    public subscribe(callback: Subscriber<T>) {
        let iSubscriber = this._subscribers.push(callback) - 1;
        return iSubscriber;
    }

    public unsubscribe(iSubscriber: number) {
        this._subscribers[iSubscriber] = null;
    }
}

export class SimpleSubject<T> extends SimpleObservable<T>{
    constructor(initialValue: T) {
        super(initialValue);
    }

    public set value(t: T) { this.setValue(t); }
    public emit(t: T) { this.setValue(t); }
}
