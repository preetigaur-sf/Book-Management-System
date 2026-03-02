import { Repository } from "../utils/Repository.js";
import { PrintedBook } from "../models/PrintedBook.js";
import { EBook } from "../models/EBook.js";
import type { Book } from "../types/Book";
import { Log } from "../decorators/log.js";

export class BookManager extends Repository<PrintedBook | EBook> {
  private filtered: (PrintedBook | EBook)[] = [];

  getAllFiltered() {
    return this.filtered;
  }

  update(index: number, book: Book, extra: number): void {
    const old = this.filtered[index];
    const realIndex = this.items.indexOf(old);

    const updated =
      book.type === "E-Book"
        ? new EBook(book, extra)
        : new PrintedBook(book, extra);

    if (realIndex !== -1) {
      this.items[realIndex] = updated;
      this.filtered = [...this.items];
    }
  }
  @Log
  loadFromJSON(data: Book[]): void {
    this.items = data.map((b) =>
      b.type === "E-Book" ? new EBook(b) : new PrintedBook(b),
    );
    this.filtered = [...this.items];
  }

  @Log
  addBook(book: Book, extra: number): void {
    const newBook =
      book.type === "E-Book"
        ? new EBook(book, extra)
        : new PrintedBook(book, extra);

    this.add(newBook);
    this.filtered = this.getAll();
  }

  search(query: string): void {
    const q = query.toLowerCase();
    this.filtered = this.items.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.name.toLowerCase().includes(q) ||
        b.isbn.includes(q),
    );
  }

  sortByTitle(): void {
    this.filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  sortByAuthor(): void {
    this.filtered.sort((a, b) => a.author.name.localeCompare(b.author.name));
  }

  sortByDate(): void {
    this.filtered.sort(
      (a, b) =>
        new Date(a.publication_date).getTime() -
        new Date(b.publication_date).getTime(),
    );
  }

  deleteByIndex(index: number): void {
    const book = this.filtered[index];
    this.remove(book);
    this.filtered = this.getAll();
  }
}
