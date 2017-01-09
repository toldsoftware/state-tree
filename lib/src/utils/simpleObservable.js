"use strict";
var SimpleSubject = (function () {
    function SimpleSubject(initialValue) {
        this._subscribers = [];
        this.setValue(initialValue);
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
        for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x) {
                x(v, oldValue);
            }
        }
    };
    SimpleSubject.prototype.subscribe = function (subscriber) {
        var iSubscriber = this._subscribers.push(subscriber) - 1;
        return iSubscriber;
    };
    SimpleSubject.prototype.unsubscribe = function (iSubscriber) {
        this._subscribers[iSubscriber] = null;
    };
    SimpleSubject.prototype.emit = function (t) { this.setValue(t); };
    return SimpleSubject;
}());
exports.SimpleSubject = SimpleSubject;
//# sourceMappingURL=simpleObservable.js.map