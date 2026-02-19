export class Repository<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  remove(index: number): void {
    this.items.splice(index, 1);
  }

  update(index: number, item: T): void {
    this.items[index] = item;
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
  
  clear():void{
    this.items = [];
  }
}
