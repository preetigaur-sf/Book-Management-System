"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericStore = void 0;
var GenericStore = /** @class */ (function () {
    function GenericStore() {
        this.items = [];
    }
    GenericStore.prototype.add = function (item) {
        this.items.push(item);
    };
    GenericStore.prototype.getAll = function () {
        return this.items;
    };
    GenericStore.prototype.remove = function (index) {
        this.items.splice(index, 1);
    };
    return GenericStore;
}());
exports.GenericStore = GenericStore;
