var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BookFactory } from "../factories/BookFactory.js";
import { Logger } from "../decorators/Logger.js";
export class BookManager {
    constructor(books) {
        this.books = books;
    }
    addBook(bookData) {
        const book = BookFactory.create(bookData);
        this.books.add(book);
    }
    getBooks() {
        return this.books.getAll();
    }
    deleteBook(index) {
        this.books.remove(index);
    }
    sortByTitle() {
        const sorted = this.books.getAll().sort((a, b) => a.title.localeCompare(b.title));
        sorted.forEach((b, i) => {
            this.books.remove(i);
        });
        sorted.forEach((b) => this.books.add(b));
    }
    sortByAuthor() {
        const sorted = this.books.getAll().sort((a, b) => a.author.name.localeCompare(b.author.name));
        sorted.forEach((b, i) => this.books.remove(i));
        sorted.forEach((b) => this.books.add(b));
    }
    sortByDate() {
        const sorted = this.books.getAll().sort((a, b) => new Date(a.publication_date).getTime() -
            new Date(b.publication_date).getTime());
        sorted.forEach((b, i) => this.books.remove(i));
        sorted.forEach((b) => this.books.add(b));
    }
}
__decorate([
    Logger
], BookManager.prototype, "addBook", null);
