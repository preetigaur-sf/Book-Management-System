export interface IStore<T> {
  add(item: T): void
  getAll(): T[]
  remove(index: number): void
}