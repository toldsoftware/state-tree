"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription = (function () {
    function Subscription() {
        this._subscribers = [];
    }
    Subscription.prototype.subscribe = function (subscriber) {
        var iSubscriber = this._subscribers.push(subscriber) - 1;
        return iSubscriber;
    };
    Subscription.prototype.unsubscribe = function (iSubscriber) {
        this._subscribers[iSubscriber] = null;
    };
    Subscription.prototype.notifySubscribers = function (args) {
        for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x) {
                x(args);
            }
        }
    };
    return Subscription;
}());
exports.Subscription = Subscription;
var SimpleSubject = (function (_super) {
    __extends(SimpleSubject, _super);
    function SimpleSubject(initialValue) {
        var _this = _super.call(this) || this;
        _this._value = initialValue;
        return _this;
    }
    Object.defineProperty(SimpleSubject.prototype, "value", {
        get: function () { return this.getValue(); },
        set: function (newValue) { this.setValue(newValue); },
        enumerable: true,
        configurable: true
    });
    SimpleSubject.prototype.getValue = function () { return this._value; };
    SimpleSubject.prototype.setValue = function (v) {
        var oldValue = this._value;
        this._value = v;
        this.notifySubscribers({ value: v, oldValue: oldValue });
    };
    SimpleSubject.prototype.emit = function (t) { this.setValue(t); };
    return SimpleSubject;
}(Subscription));
exports.SimpleSubject = SimpleSubject;
//# sourceMappingURL=simpleObservable.js.map