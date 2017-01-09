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
    function StateNode(tree, parent, path, initialValue, isArray) {
        var _this = _super.call(this, initialValue) || this;
        _this.tree = tree;
        _this.parent = parent;
        _this.isArray = isArray;
        _this.path = path;
        return _this;
    }
    Object.defineProperty(StateNode.prototype, "path", {
        get: function () { return this._path; },
        set: function (v) {
            this._path = v;
            this._fullPath = !this.parent ? this.path : this.parent.fullPath + (this.parent && this.parent.isArray ? "[" + this._path + "]" : "." + this._path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "fullPath", {
        get: function () { return this._fullPath; },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.getValue = function (shouldSkipLog) {
        if (shouldSkipLog === void 0) { shouldSkipLog = false; }
        // Rebuild value from children values
        var value = this._value;
        if (typeof value === 'object') {
            var reconstructed = (this.isArray ? [] : {});
            for (var k in value) {
                reconstructed[k] = this[k].getValue();
            }
            value = reconstructed;
        }
        if (!shouldSkipLog) {
            this.tree.notify_getValue(this.fullPath, value);
        }
        return value;
    };
    StateNode.prototype.setValue = function (newValue) {
        var oldValue = this.getValue(true);
        if (newValue === stateData_1.DELETE) {
            newValue = null;
        }
        this._value = newValue;
        var tree = this.tree;
        var node = this;
        if (newValue != null) {
            for (var k in newValue) {
                var kValue = newValue[k];
                if (!node[k]) {
                    // Create State Nodes for new Properties
                    node[k] = createStateNode(tree, node, k, kValue);
                }
                else {
                    // Set Nested Value
                    node[k].setValue(kValue);
                }
            }
        }
        else {
            // Pass Null Down Branch
            for (var k in node) {
                if (node[k] instanceof StateNode) {
                    node[k].setValue(null);
                }
            }
        }
        this.notifySubscribers(newValue, oldValue);
        this.tree.notify_setValue(this.fullPath, newValue, oldValue);
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