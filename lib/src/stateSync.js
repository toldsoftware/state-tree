"use strict";
var stateTree_1 = require("./stateTree");
var StateSync = (function () {
    function StateSync(tree, storage) {
        this.tree = tree;
        this.storage = storage;
        this.setup();
    }
    StateSync.prototype.setup = function () {
        var _this = this;
        this.tree.subscribe(function (x) {
            if (x.kind === stateTree_1.StateNotificationKind[stateTree_1.StateNotificationKind.getValue]) {
                return;
            }
            var change = {
                uuid: newUuid(),
                newStateDelta: _this.toStateData(x.stateNodeFullPath, x.valueJson),
                oldStateDelta: _this.toStateData(x.stateNodeFullPath, x.valueJson_old),
                metadata: _this._metadata
            };
            _this.storage.appendStateChange(JSON.stringify(change));
        });
    };
    StateSync.prototype.beginContext = function (metadata) {
        if (this._metadata != null) {
            throw 'endContext was not called';
        }
        this._metadata = metadata;
    };
    StateSync.prototype.endContext = function () {
        if (this._metadata != null) {
            throw 'beginContext was not called';
        }
        this._metadata = null;
    };
    StateSync.prototype.toStateData = function (fullPath, jsonValue) {
        var parts = fullPath.split(/\.|\[/g);
        if (parts[0] === '') {
            parts.splice(0, 1);
        }
        ;
        var state = {};
        var node = state;
        for (var i = 0; i < parts.length; i++) {
            var x = parts[i];
            if (x[x.length - 1] === ']') {
                x = x.substr(0, x.length - 2);
            }
            if (i === parts.length - 1) {
                node[x] = JSON.parse(jsonValue);
                break;
            }
            node[x] = {};
            node = node[x];
        }
        return state;
    };
    return StateSync;
}());
exports.StateSync = StateSync;
function newUuid() {
    // TODO: Use a real Uuid provider
    return '' + Math.random() + '' + Math.random();
}
//# sourceMappingURL=stateSync.js.map