import { PrintedBook } from "../models/PrintedBook";
import { EBook } from "../models/EBook";
export class BookManager {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
    }
    getAll() {
        return this.filteredBooks;
    }
    loadFromJSON(data) {
        this.books = data.map((b, i) => i % 2 === 0 ? new PrintedBook(b) : new EBook(b));
        this.filteredBooks = [...this.books];
    }
    add(bookData) {
        const book = Math.random() > 0.5
            ? new PrintedBook(bookData)
            : new EBook(bookData);
        this.books.push(book);
        this.filteredBooks = [...this.books];
    }
    update(index, bookData) {
        const oldBook = this.filteredBooks[index];
        const realIndex = this.books.indexOf(oldBook);
        const updated = oldBook.type === "Printed"
            ? new PrintedBook(bookData)
            : new EBook(bookData);
        this.books[realIndex] = updated;
        this.filteredBooks = [...this.books];
    }
    delete(index) {
        const book = this.filteredBooks[index];
        this.books = this.books.filter(b => b !== book);
        this.filteredBooks = [...this.books];
    }
    search(query) {
        const q = query.toLowerCase();
        this.filteredBooks = this.books.filter(b => b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.includes(q));
    }
    sortByTitle() {
        this.filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
    sortByAuthor() {
        this.filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
    }
    sortByDate() {
        this.filteredBooks.sort((a, b) => new Date(a.publication_date).getTime() -
            new Date(b.publication_date).getTime());
    }
}
