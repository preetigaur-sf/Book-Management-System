export class GenericStore {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
    remove(index) {
        this.items.splice(index, 1);
    }
}
