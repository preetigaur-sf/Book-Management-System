"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
class Repository {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return [...this.items];
    }
    remove(index) {
        this.items.splice(index, 1);
    }
    update(index, item) {
        this.items[index] = item;
    }
    find(predicate) {
        return this.items.filter(predicate);
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map