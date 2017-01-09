"use strict";
function delay(timeMs) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(); }, timeMs);
    });
}
exports.delay = delay;
//# sourceMappingURL=async.js.map