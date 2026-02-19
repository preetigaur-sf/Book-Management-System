var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseBook } from "../models/BaseBook.js";
import { Author } from "../models/Author.js";
import { Category } from "../models/Category.js";
import { Repository } from "./Repository.js";
import { Log } from "../decorators/log.js";
export class BookManager {
    constructor() {
        this.bookRepo = new Repository();
        this.editIndex = null;
        this.cacheDOM();
        this.addEventListeners();
        this.loadBooks();
    }
    cacheDOM() {
        this.tableBody = document.getElementById("tableBody");
        this.bookForm = document.getElementById("bookForm");
        this.searchInput = document.getElementById("searchInput");
        this.titleInput = document.getElementById("title");
        this.authorInput = document.getElementById("author");
        this.isbnInput = document.getElementById("isbn");
        this.publicationDateInput = document.getElementById("publicationDate");
        this.genreInput = document.getElementById("genre");
        this.priceInput = document.getElementById("price");
    }
    loadBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/dist/data.json");
                const data = yield response.json();
                this.bookRepo.clear();
                this.editIndex = null;
                data.forEach((item) => {
                    const book = new BaseBook(item.title, new Author(item.author), item.isbn, item.publicationDate, new Category(item.genre), item.price);
                    this.bookRepo.add(book);
                });
                this.render();
            }
            catch (error) {
                console.error("Error loading data:", error);
            }
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const book = new BaseBook(this.titleInput.value, new Author(this.authorInput.value), this.isbnInput.value, this.publicationDateInput.value, new Category(this.genreInput.value), Number(this.priceInput.value));
        if (this.editIndex !== null) {
            this.bookRepo.update(this.editIndex, book);
            this.editIndex = null;
        }
        else {
            this.bookRepo.add(book);
        }
        this.bookForm.reset();
        this.render();
    }
    deleteBook(index) {
        this.bookRepo.remove(index);
        this.render();
    }
    sortBooks(criteria, ascending = true) {
        const books = this.bookRepo.getAll();
        const sortedBooks = [...books].sort((a, b) => {
            switch (criteria) {
                case "title":
                    return ascending
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                case "author":
                    return ascending
                        ? a.author.name.localeCompare(b.author.name)
                        : b.author.name.localeCompare(a.author.name);
                case "date":
                    const dateA = new Date(a.publicationDate).getTime();
                    const dateB = new Date(b.publicationDate).getTime();
                    return ascending ? dateA - dateB : dateB - dateA;
            }
        });
        this.render(sortedBooks);
    }
    handleSearch() {
        const query = this.searchInput.value.toLowerCase();
        const filtered = this.bookRepo.find((book) => book.title.toLowerCase().includes(query) ||
            book.author.name.toLowerCase().includes(query));
        this.render(filtered);
    }
    render(books = this.bookRepo.getAll()) {
        this.tableBody.innerHTML = "";
        books.forEach((book, index) => {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author.name}</td>
        <td>${book.isbn}</td>
        <td>${book.publicationDate}</td>
        <td>${book.age}</td>
        <td>${book.genre.name}</td>
        <td>${book.price}</td>
        <td>
          <button data-edit="${index}">Edit</button>
          <button data-delete="${index}">Delete</button>
        </td>
        <td>${(_a = book.type) !== null && _a !== void 0 ? _a : "-"}</td>
        <td>${(_b = book.extraInfo) !== null && _b !== void 0 ? _b : "-"}</td>
      `;
            this.tableBody.appendChild(row);
        });
        this.tableBody.querySelectorAll("[data-delete]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = Number(e.target.dataset.delete);
                this.deleteBook(index);
            });
        });
        this.tableBody.querySelectorAll("[data-edit]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = Number(e.target.dataset.edit);
                const book = this.bookRepo.getAll()[index];
                this.titleInput.value = book.title;
                this.authorInput.value = book.author.name;
                this.isbnInput.value = book.isbn;
                this.publicationDateInput.value = book.publicationDate;
                this.genreInput.value = book.genre.name;
                this.priceInput.value = book.price.toString();
                this.editIndex = index;
            });
        });
    }
    addEventListeners() {
        this.bookForm.addEventListener("submit", this.handleSubmit.bind(this));
        this.searchInput.addEventListener("input", this.handleSearch.bind(this));
        const sortTitleBtn = document.getElementById("sortTitle");
        const sortAuthorBtn = document.getElementById("sortAuthor");
        const sortDateBtn = document.getElementById("sortDate");
        let titleAsc = true;
        let authorAsc = true;
        let dateAsc = true;
        sortTitleBtn.addEventListener("click", () => {
            this.sortBooks("title", titleAsc);
            titleAsc = !titleAsc;
        });
        sortAuthorBtn.addEventListener("click", () => {
            this.sortBooks("author", authorAsc);
            authorAsc = !authorAsc;
        });
        sortDateBtn.addEventListener("click", () => {
            this.sortBooks("date", dateAsc);
            dateAsc = !dateAsc;
        });
    }
}
__decorate([
    Log
], BookManager.prototype, "loadBooks", null);
__decorate([
    Log
], BookManager.prototype, "handleSubmit", null);
__decorate([
    Log
], BookManager.prototype, "deleteBook", null);
__decorate([
    Log
], BookManager.prototype, "sortBooks", null);
__decorate([
    Log
], BookManager.prototype, "handleSearch", null);
//# sourceMappingURL=BookManager.js.map