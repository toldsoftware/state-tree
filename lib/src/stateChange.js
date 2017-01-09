"use strict";
var stateData_1 = require("./stateData");
function mergeChanges(initialStateData, stateChanges) {
    var verified = [];
    var uuids = {};
    for (var _i = 0, stateChanges_1 = stateChanges; _i < stateChanges_1.length; _i++) {
        var x = stateChanges_1[_i];
        if (uuids[x.uuid]) {
            continue;
        }
        verified.push(x);
        uuids[x.uuid] = true;
    }
    return mergeStateData([initialStateData].concat(verified.map(function (x) { return toChangeWithDelete(x.oldStateDelta, x.newStateDelta); })));
}
exports.mergeChanges = mergeChanges;
function reverseChanges(stateData, stateChanges_toReverse) {
    var verified = [];
    var uuids = {};
    for (var _i = 0, stateChanges_toReverse_1 = stateChanges_toReverse; _i < stateChanges_toReverse_1.length; _i++) {
        var x = stateChanges_toReverse_1[_i];
        if (uuids[x.uuid]) {
            continue;
        }
        verified.push(x);
        uuids[x.uuid] = true;
    }
    return mergeStateData([stateData].concat(verified.map(function (x) { return toChangeWithDelete(x.newStateDelta, x.oldStateDelta); }).reverse()));
}
exports.reverseChanges = reverseChanges;
function toChangeWithDelete(oldState, newState) {
    var clone = {};
    assignDeep(clone, oldState);
    markDeleteDeep(clone);
    assignDeep(clone, newState);
    return clone;
}
function markDeleteDeep(obj) {
    for (var k in obj) {
        if (typeof obj[k] === 'object') {
            markDeleteDeep(obj[k]);
        }
        else {
            obj[k] = stateData_1.DELETE;
        }
    }
}
function mergeStateData(stateData) {
    var result = {};
    for (var _i = 0, stateData_2 = stateData; _i < stateData_2.length; _i++) {
        var x = stateData_2[_i];
        assignDeep(result, x);
    }
    return result;
}
exports.mergeStateData = mergeStateData;
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
//# sourceMappingURL=stateChange.js.map