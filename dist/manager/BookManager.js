var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Repository } from "../utils/Repository.js";
import { PrintedBook } from "../models/PrintedBook.js";
import { EBook } from "../models/EBook.js";
import { Log } from "../decorators/log.js";
export class BookManager extends Repository {
    constructor() {
        super(...arguments);
        this.filtered = [];
    }
    getAllFiltered() {
        return this.filtered;
    }
    update(index, book, extra) {
        const old = this.filtered[index];
        const realIndex = this.items.indexOf(old);
        const updated = book.type === "E-Book"
            ? new EBook(book, extra)
            : new PrintedBook(book, extra);
        if (realIndex !== -1) {
            this.items[realIndex] = updated;
            this.filtered = [...this.items];
        }
    }
    loadFromJSON(data) {
        this.items = data.map((b) => b.type === "E-Book" ? new EBook(b) : new PrintedBook(b));
        this.filtered = [...this.items];
    }
    addBook(book, extra) {
        const newBook = book.type === "E-Book"
            ? new EBook(book, extra)
            : new PrintedBook(book, extra);
        this.add(newBook);
        this.filtered = this.getAll();
    }
    search(query) {
        const q = query.toLowerCase();
        this.filtered = this.items.filter((b) => b.title.toLowerCase().includes(q) ||
            b.author.name.toLowerCase().includes(q) ||
            b.isbn.includes(q));
    }
    sortByTitle() {
        this.filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    sortByAuthor() {
        this.filtered.sort((a, b) => a.author.name.localeCompare(b.author.name));
    }
    sortByDate() {
        this.filtered.sort((a, b) => new Date(a.publication_date).getTime() -
            new Date(b.publication_date).getTime());
    }
    deleteByIndex(index) {
        const book = this.filtered[index];
        this.remove(book);
        this.filtered = this.getAll();
    }
}
__decorate([
    Log
], BookManager.prototype, "loadFromJSON", null);
__decorate([
    Log
], BookManager.prototype, "addBook", null);
