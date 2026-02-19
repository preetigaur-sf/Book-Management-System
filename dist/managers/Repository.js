export class Repository {
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
    clear() {
        this.items = [];
    }
}
//# sourceMappingURL=Repository.js.map