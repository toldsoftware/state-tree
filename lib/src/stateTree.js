"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require("./utils");
var stateData_1 = require("./stateData");
// let test = { text: 'A', nested: { text: 'A', nested: { text: 'B' } } };
// let testResult = toStateTree(test);
// let t1 = testResult.nested.nested.text;
function toStateTree(stateData) {
    // Swap the raw object with get/set properties
    var tree = new StateTree(stateData);
    return toStateNode(tree, '', tree, stateData);
}
exports.toStateTree = toStateTree;
function toStateNode(tree, path, target, source) {
    for (var k in source) {
        var v = source[k];
        var kNode = new StateNode(target, k, v);
        if (typeof v === 'object') {
            toProperty(tree, target, k, toStateNode(tree, k, kNode, v));
        }
        else {
            toProperty(tree, target, k, kNode);
        }
    }
    return target;
}
function toProperty(tree, host, name, value) {
    addProperty(host, name, function () {
        tree.notify_getValue(value);
        // let val = value.getValue();
        // if (val['subscribe'] == null) {
        //     val['subscribe'] = value.subscribe;
        //     val['unsubscribe'] = value.unsubscribe;
        // }
        // return val;
        return value;
    }, function (v) {
        tree.notify_setValue(value, v);
        value.setValue(v);
        if (v != null) {
            for (var k in v) {
                if (!value[k] && v[k] !== stateData_1.DELETE) {
                    // Handle Added Properties
                    toProperty(tree, value, k, new StateNode(value, k, v[k]));
                }
                else if (v[k] === stateData_1.DELETE) {
                    // Handle DELETE value
                    value[k] = null;
                }
                else {
                    // Set Nested Value
                    value[k] = v[k];
                }
            }
        }
        else {
            // Pass Null Down Branch
            for (var k in value) {
                if (value[k] instanceof StateNode) {
                    value[k] = null;
                }
            }
        }
    });
}
function addProperty(obj, name, getValue, setValue) {
    Object.defineProperty(obj, name, {
        get: function () { return getValue(); },
        set: function (v) { setValue(v); },
        enumerable: true,
        configurable: true
    });
}
// function assign(target: any, source: any) {
//     for (let k in source) {
//         target[k] = source[k];
//     }
//     return target;
// }
// export class StateNode implements Observable<any> {
//     private _value = new SimpleSubject<any>(null);
//     getValue() {
//         return this._value.getValue();
//     };
//     setValue(v: any) {
//         this._value.emit(v);
//     }
//     fullPath: string;
//     constructor(public parent: StateNode, public path: string, initialValue: any) {
//         this.setValue(initialValue);
//         this.fullPath = !this.parent ? this.path : this.parent.fullPath + '.' + this.path;
//     }
//     subscribe(subscriber: Subscriber<any>) {
//         return this._value.subscribe(subscriber);
//     }
//     unsubscribe(iSubscriber: number) {
//         return this._value.unsubscribe(iSubscriber);
//     }
// }
var StateNode = (function (_super) {
    __extends(StateNode, _super);
    function StateNode(parent, path, initialValue) {
        var _this = _super.call(this, initialValue) || this;
        _this.parent = parent;
        _this.path = path;
        _this.fullPath = !_this.parent ? _this.path : _this.parent.fullPath + '.' + _this.path;
        return _this;
    }
    StateNode.prototype.getValue = function () {
        // Rebuild value from children values
        var value = _super.prototype.getValue.call(this);
        if (typeof value !== 'object') {
            return value;
        }
        var r = {};
        for (var k in value) {
            r[k] = this[k].getValue();
        }
        return r;
    };
    return StateNode;
}(utils_1.SimpleSubject));
exports.StateNode = StateNode;
var StateTree = (function (_super) {
    __extends(StateTree, _super);
    function StateTree(initialValue) {
        if (initialValue === void 0) { initialValue = null; }
        var _this = _super.call(this, null, '', initialValue) || this;
        _this.notifications = [];
        return _this;
    }
    StateTree.prototype.notify_getValue = function (stateNode) {
        this.notifications.push({
            kind: StateNotificationKind.getValue,
            stateNodeFullPath: stateNode.fullPath,
            valueJson: JSON.stringify(stateNode.getValue()),
        });
    };
    StateTree.prototype.notify_setValue = function (stateNode, value) {
        this.notifications.push({
            kind: StateNotificationKind.setValue,
            stateNodeFullPath: stateNode.fullPath,
            valueJson_old: JSON.stringify(stateNode.getValue()),
            valueJson: JSON.stringify(value),
        });
    };
    return StateTree;
}(StateNode));
exports.StateTree = StateTree;
var StateNotificationKind;
(function (StateNotificationKind) {
    StateNotificationKind[StateNotificationKind["getValue"] = 0] = "getValue";
    StateNotificationKind[StateNotificationKind["setValue"] = 1] = "setValue";
})(StateNotificationKind = exports.StateNotificationKind || (exports.StateNotificationKind = {}));
//# sourceMappingURL=stateTree.js.map