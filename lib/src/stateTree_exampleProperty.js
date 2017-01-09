"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base2Test = (function () {
    function Base2Test() {
    }
    return Base2Test;
}());
exports.Base2Test = Base2Test;
var BaseTest = (function (_super) {
    __extends(BaseTest, _super);
    function BaseTest() {
        return _super.call(this) || this;
    }
    return BaseTest;
}(Base2Test));
exports.BaseTest = BaseTest;
var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Test.prototype, "a", {
        get: function () { return true; },
        set: function (v) { v; },
        enumerable: true,
        configurable: true
    });
    return Test;
}(BaseTest));
exports.Test = Test;
//# sourceMappingURL=stateTree_exampleProperty.js.map