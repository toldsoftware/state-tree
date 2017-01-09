"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleObservable = (function () {
    function SimpleObservable(initialValue) {
        this._history = [];
        // public get currentValue() { return this._value; }
        this._subscribers = [];
        this.setValue(initialValue);
    }
    Object.defineProperty(SimpleObservable.prototype, "history", {
        get: function () { return this._history.map(function (x) { return x; }); },
        enumerable: true,
        configurable: true
    });
    SimpleObservable.prototype.setValue = function (newValue) {
        var oldValue = this._value;
        this._value = newValue;
        this._history.push(newValue);
        for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x) {
                x(newValue, oldValue);
            }
        }
    };
    SimpleObservable.prototype.subscribe = function (callback) {
        var iSubscriber = this._subscribers.push(callback) - 1;
        return iSubscriber;
    };
    SimpleObservable.prototype.unsubscribe = function (iSubscriber) {
        this._subscribers[iSubscriber] = null;
    };
    return SimpleObservable;
}());
exports.SimpleObservable = SimpleObservable;
var SimpleSubject = (function (_super) {
    __extends(SimpleSubject, _super);
    function SimpleSubject(initialValue) {
        return _super.call(this, initialValue) || this;
    }
    Object.defineProperty(SimpleSubject.prototype, "value", {
        set: function (t) { this.setValue(t); },
        enumerable: true,
        configurable: true
    });
    SimpleSubject.prototype.emit = function (t) { this.setValue(t); };
    return SimpleSubject;
}(SimpleObservable));
exports.SimpleSubject = SimpleSubject;
//# sourceMappingURL=simpleObservable.js.map