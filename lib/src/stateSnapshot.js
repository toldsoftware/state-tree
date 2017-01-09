"use strict";
var stateData_1 = require("./stateData");
function mergeChanges(changes) {
    var result = {};
    for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
        var x = changes_1[_i];
        assignDeep(result, x);
    }
    return result;
}
exports.mergeChanges = mergeChanges;
function assignDeep(target, source) {
    if (source == null) {
        return;
    }
    for (var k in source) {
        var v = source[k];
        if (v == null) {
            continue;
        }
        if (v === stateData_1.DELETE) {
            delete (target[k]);
        }
        else if (typeof v === 'object') {
            target[k] = target[k] || {};
            assignDeep(target[k], v);
        }
        else {
            target[k] = v;
        }
    }
}
//# sourceMappingURL=stateSnapshot.js.map