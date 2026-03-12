"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = Logger;
function Logger(target, propertyKey, descriptor) {
    var original = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log("Method called: ".concat(propertyKey));
        return original.apply(this, args);
    };
}
