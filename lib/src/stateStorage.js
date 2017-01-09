"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var async_1 = require("./async");
var MemoryStateStorage = (function () {
    function MemoryStateStorage() {
        this.changes = [];
    }
    MemoryStateStorage.prototype.getStateChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.changes.map(function (x) { return x; })];
            });
        });
    };
    MemoryStateStorage.prototype.appendStateChange = function () {
        var stateChanges = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stateChanges[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (_a = this.changes).push.apply(_a, stateChanges);
                return [2 /*return*/];
            });
        });
    };
    return MemoryStateStorage;
}());
exports.MemoryStateStorage = MemoryStateStorage;
var DelayedMemoryStateStorage = (function () {
    function DelayedMemoryStateStorage(delayTime) {
        if (delayTime === void 0) { delayTime = 3000; }
        this.delayTime = delayTime;
        this.changes = [];
    }
    DelayedMemoryStateStorage.prototype.getStateChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, async_1.delay(this.delayTime)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.changes.map(function (x) { return x; })];
                }
            });
        });
    };
    DelayedMemoryStateStorage.prototype.appendStateChange = function () {
        var stateChanges = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stateChanges[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, async_1.delay(this.delayTime)];
                    case 1:
                        _b.sent();
                        (_a = this.changes).push.apply(_a, stateChanges);
                        return [2 /*return*/];
                }
            });
        });
    };
    return DelayedMemoryStateStorage;
}());
exports.DelayedMemoryStateStorage = DelayedMemoryStateStorage;
// AutoSync State Changes to provider
// - Retry failed appends
// - Delay appends to give a chance to merge requests
var SyncStateStorage = (function () {
    function SyncStateStorage(provider, delayTime) {
        if (delayTime === void 0) { delayTime = 250; }
        this.provider = provider;
        this.delayTime = delayTime;
        this.pending = [];
        this.pending_resolves = [];
        this.syncBusy = false;
    }
    SyncStateStorage.prototype.getStateChanges = function () {
        return this.provider.getStateChanges();
    };
    SyncStateStorage.prototype.appendStateChange = function () {
        var _this = this;
        var stateChanges = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stateChanges[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            (_a = _this.pending).push.apply(_a, stateChanges);
            _this.pending_resolves.push(resolve);
            _this.sync().then();
            var _a;
        });
    };
    SyncStateStorage.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pendingSnapshot, resolvesSnapshot, err_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.syncBusy) {
                            return [2 /*return*/];
                        }
                        if (!this.pending.length) {
                            return [2 /*return*/];
                        }
                        this.syncBusy = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, async_1.delay(this.delayTime)];
                    case 2:
                        _b.sent();
                        pendingSnapshot = this.pending.map(function (x) { return x; });
                        resolvesSnapshot = this.pending_resolves.map(function (x) { return x; });
                        // Append the State Changes in Proper Order
                        return [4 /*yield*/, (_a = this.provider).appendStateChange.apply(_a, pendingSnapshot)];
                    case 3:
                        // Append the State Changes in Proper Order
                        _b.sent();
                        resolvesSnapshot.forEach(function (x) { return x(); });
                        this.pending = this.pending.splice(0, pendingSnapshot.length);
                        this.pending_resolves = this.pending_resolves.splice(0, pendingSnapshot.length);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        this.syncBusy = false;
                        this.sync();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SyncStateStorage;
}());
exports.SyncStateStorage = SyncStateStorage;
var CachedSyncStateStorage = (function (_super) {
    __extends(CachedSyncStateStorage, _super);
    function CachedSyncStateStorage(provider, delayTime) {
        if (delayTime === void 0) { delayTime = 250; }
        var _this = _super.call(this, provider, delayTime) || this;
        _this.cache_appended = [];
        return _this;
    }
    CachedSyncStateStorage.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.cache_initial == null))
                            return [3 /*break*/, 2];
                        this.cache_initial = [];
                        _a = this;
                        return [4 /*yield*/, _super.prototype.getStateChanges.call(this)];
                    case 1:
                        _a.cache_initial = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CachedSyncStateStorage.prototype.getStateChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setup()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.cache_initial.concat(this.cache_appended)];
                }
            });
        });
    };
    CachedSyncStateStorage.prototype.appendStateChange = function () {
        var stateChanges = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stateChanges[_i] = arguments[_i];
        }
        this.setup().then();
        (_a = this.cache_appended).push.apply(_a, stateChanges);
        return _super.prototype.appendStateChange.apply(this, stateChanges);
        var _a;
    };
    return CachedSyncStateStorage;
}(SyncStateStorage));
exports.CachedSyncStateStorage = CachedSyncStateStorage;
//# sourceMappingURL=stateStorage.js.map