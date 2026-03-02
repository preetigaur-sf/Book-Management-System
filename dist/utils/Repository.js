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
    remove(item) {
        this.items = this.items.filter(i => i !== item);
    }
}
