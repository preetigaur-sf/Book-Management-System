import { IStore } from "../interfaces/IStore.js"

export class GenericStore<T> implements IStore<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  getAll(): T[] {
    return this.items
  }

  remove(index: number): void {
    this.items.splice(index, 1)
  }
}