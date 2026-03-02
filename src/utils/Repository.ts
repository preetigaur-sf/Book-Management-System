export class Repository<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  remove(item: T): void {
    this.items = this.items.filter(i => i !== item);
  }
}