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
// let t1 = testResult.nested.nested.text.value;
function toStateTree(stateData) {
    // Swap the raw object with get/set properties
    var tree = new StateTree();
    var root = createStateNode(tree, null, '', stateData);
    for (var k in stateData) {
        tree[k] = root[k];
    }
    tree.root = root;
    return tree;
}
exports.toStateTree = toStateTree;
function createStateNode(tree, parent, path, source) {
    var node = new StateNode(tree, parent, path, source, source instanceof Array);
    if (typeof source === 'object') {
        for (var k in source) {
            node[k] = createStateNode(tree, node, k, source[k]);
        }
    }
    return node;
}
var StateNode = (function (_super) {
    __extends(StateNode, _super);
    function StateNode(_tree, _parent, path, initialValue, _isArray) {
        var _this = _super.call(this, initialValue) || this;
        _this._tree = _tree;
        _this._parent = _parent;
        _this._isArray = _isArray;
        _this.path = path;
        return _this;
    }
    Object.defineProperty(StateNode.prototype, "path", {
        get: function () { return this._path; },
        set: function (v) {
            this._path = v;
            this._fullPath = !this._parent ? this.path : this._parent.fullPath + (this._parent && this._parent._isArray ? "[" + this._path + "]" : "." + this._path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "fullPath", {
        get: function () { return this._fullPath; },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.getChildrenNames = function () {
        var node = this;
        var keys = [];
        for (var k in node) {
            if (k[0] !== '_') {
                var prop = Object.getOwnPropertyDescriptor(node, k);
                if (prop != null && prop.get == null) {
                    var child = node[k];
                    if (child != null
                        && child instanceof StateNode
                        && child._parent === node) {
                        keys.push(k);
                    }
                }
            }
        }
        return keys;
    };
    StateNode.prototype.getValue = function (shouldNotifyTree) {
        if (shouldNotifyTree === void 0) { shouldNotifyTree = true; }
        // Rebuild value from children values
        var value = this._value;
        if (value != null && typeof value === 'object') {
            var reconstructed = (this._isArray ? [] : {});
            for (var _i = 0, _a = this.getChildrenNames(); _i < _a.length; _i++) {
                var k = _a[_i];
                var kNode = this[k];
                if (kNode == null) {
                    var breakdance = true;
                }
                var kValue = kNode.getValue();
                if (kValue != null) {
                    reconstructed[k] = kValue;
                }
            }
            value = reconstructed;
        }
        if (shouldNotifyTree) {
            this._tree.notify_getValue(this.fullPath, value);
        }
        return value;
    };
    Object.defineProperty(StateNode.prototype, "value_merge", {
        set: function (newValue) {
            this.setValue(newValue, false);
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.setValue = function (newValue, shouldRemoveMissing, shouldNotifyTree) {
        if (shouldRemoveMissing === void 0) { shouldRemoveMissing = true; }
        if (shouldNotifyTree === void 0) { shouldNotifyTree = true; }
        var oldValue = this.getValue(false);
        if (newValue === stateData_1.DELETE) {
            newValue = null;
        }
        this._value = newValue;
        var node = this;
        if (newValue != null) {
            var keys_set_1 = [];
            for (var k in newValue) {
                var kValue = newValue[k];
                if (!node[k]) {
                    // Create State Nodes for new Properties
                    node[k] = createStateNode(this._tree, node, k, kValue);
                }
                else {
                    // Set Nested Value
                    node[k].setValue(kValue, shouldRemoveMissing, false);
                }
                keys_set_1.push(k);
            }
            // Missing keys
            if (shouldRemoveMissing) {
                var keys_missing = this.getChildrenNames().filter(function (x) { return keys_set_1.indexOf(x) < 0; });
                for (var _i = 0, keys_missing_1 = keys_missing; _i < keys_missing_1.length; _i++) {
                    var k = keys_missing_1[_i];
                    node[k].setValue(null, shouldRemoveMissing, false);
                }
            }
        }
        else {
            if (shouldRemoveMissing) {
                // Pass Null Down Branch
                for (var _a = 0, _b = this.getChildrenNames(); _a < _b.length; _a++) {
                    var k = _b[_a];
                    node[k].setValue(null, shouldRemoveMissing, false);
                }
            }
        }
        this.notifySubscribers(newValue, oldValue);
        if (shouldNotifyTree) {
            this._tree.notify_setValue(this.fullPath, newValue, oldValue);
        }
    };
    StateNode.prototype.asArray = function () {
        return this;
    };
    return StateNode;
}(utils_1.SimpleSubject));
exports.StateNode = StateNode;
// export class StateNodeArray<T extends any[]>{
// }
var StateTree = (function () {
    function StateTree() {
        this.notifications = [];
    }
    StateTree.prototype.notify_getValue = function (stateNodeFullPath, value) {
        this.notifications.push({
            kind: StateNotificationKind.getValue,
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(value),
        });
    };
    StateTree.prototype.notify_setValue = function (stateNodeFullPath, value, oldValue) {
        this.notifications.push({
            kind: StateNotificationKind.setValue,
            stateNodeFullPath: stateNodeFullPath,
            valueJson: JSON.stringify(value),
            valueJson_old: JSON.stringify(oldValue),
        });
    };
    return StateTree;
}());
exports.StateTree = StateTree;
var StateNotificationKind;
(function (StateNotificationKind) {
    StateNotificationKind[StateNotificationKind["getValue"] = 0] = "getValue";
    StateNotificationKind[StateNotificationKind["setValue"] = 1] = "setValue";
})(StateNotificationKind = exports.StateNotificationKind || (exports.StateNotificationKind = {}));
//# sourceMappingURL=stateTree.js.map