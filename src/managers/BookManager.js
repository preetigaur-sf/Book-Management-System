"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookManager = void 0;
const EBook_1 = require("../models/EBook");
const PrintedBook_1 = require("../models/PrintedBook");
const Author_1 = require("../models/Author");
const Category_1 = require("../models/Category");
const Repository_1 = require("./Repository");
class BookManager {
    constructor() {
        this.bookRepo = new Repository_1.Repository();
        this.books = [];
        this.editIndex = null;
        this.handleSearch = (e) => {
            const input = e.target;
            const query = input.value.toLowerCase().trim();
            const filtered = this.books.filter((b) => b.title.toLowerCase().includes(query) ||
                b.author.name.toLowerCase().includes(query) ||
                b.isbn.includes(query));
            this.tableBody.innerHTML = "";
            filtered.forEach((book) => {
                const row = document.createElement("tr");
                row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author.name}</td>
        <td>${book.isbn}</td>
        <td>${book.publicationDate}</td>
        <td>${book.age}</td>
        <td>${book.genre.name}</td>
        <td>₹ ${book.price}</td>
        <td>₹ ${book.calculateDiscountPrice().toFixed(2)}</td>
      `;
                this.tableBody.appendChild(row);
            });
        };
        this.validateForm = () => __awaiter(this, void 0, void 0, function* () {
            const author = new Author_1.Author(this.authorInput.value.trim());
            const category = new Category_1.Category(this.genreInput.value.trim());
            const bookData = {
                title: this.titleInput.value.trim(),
                author,
                isbn: this.isbnInput.value.trim(),
                publicationDate: this.publicationDateInput.value,
                genre: category,
                price: Number(this.priceInput.value),
            };
            try {
                this.validateInputs(bookData);
                const book = Math.random() > 0.5
                    ? new EBook_1.EBook(bookData.title, bookData.author, bookData.isbn, bookData.publicationDate, bookData.genre, bookData.price, 5)
                    : new PrintedBook_1.PrintedBook(bookData.title, bookData.author, bookData.isbn, bookData.publicationDate, bookData.genre, bookData.price, 250);
                yield this.simulateServerDelay(book);
                this.bookRepo.add(book);
                this.bookForm.reset();
                this.renderUI();
            }
            catch (err) {
                if (err instanceof Error)
                    alert(err.message);
            }
        });
        this.cacheDOM();
        this.addEventListeners();
    }
    getEl(id) {
        const el = document.getElementById(id);
        if (!el)
            throw new Error(`Element with id '${id}' not found`);
        return el;
    }
    cacheDOM() {
        this.tableBody = this.getEl("tableBody");
        this.mobileTableBody = this.getEl("mobileTableBody");
        this.addBookBtn = this.getEl("addBookBtn");
        this.loadJsonBtn = this.getEl("loadJsonBtn");
        this.searchInput = this.getEl("searchInput");
        this.titleInput = this.getEl("title");
        this.authorInput = this.getEl("author");
        this.isbnInput = this.getEl("isbn");
        this.publicationDateInput = this.getEl("publicationDate");
        this.genreInput = this.getEl("genre");
        this.priceInput = this.getEl("price");
        this.bookForm = this.getEl("bookForm");
    }
    simulateServerDelay(book) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                book.title && book.author.name
                    ? resolve(`Book "${book.title}" saved successfully!`)
                    : reject(new Error("Book data invalid!"));
            }, 1000);
        });
    }
    validateInputs(book) {
        if (!book.title ||
            !book.author.name ||
            !book.isbn ||
            !book.publicationDate ||
            !book.genre.name) {
            throw new Error("All fields are required");
        }
        if (isNaN(book.price) || book.price <= 0) {
            throw new Error("Price must be a valid positive number");
        }
        if (!/^\d{10}(\d{3})?$/.test(book.isbn)) {
            throw new Error("ISBN must be 10 or 13 digits");
        }
        if (this.books.some((b, i) => b.isbn === book.isbn && i !== this.editIndex)) {
            throw new Error("Book with this ISBN already exists");
        }
    }
    renderUI() {
        this.tableBody.innerHTML = "";
        this.mobileTableBody.innerHTML = "";
        this.books.forEach((book) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author.name}</td>
        <td>${book.isbn}</td>
        <td>${book.publicationDate}</td>
        <td>${book.age}</td>
        <td>${book.genre.name}</td>
        <td>₹ ${book.price}</td>
        <td>₹ ${book.calculateDiscountPrice().toFixed(2)}</td>
      `;
            this.tableBody.appendChild(row);
            const card = document.createElement("div");
            card.innerHTML = `
        <p><strong>${book.title}</strong></p>
        <p>${book.author.name}</p>
        <p>${book.genre.name}</p>
        <p>₹ ${book.price}</p>
      `;
            this.mobileTableBody.appendChild(card);
        });
    }
    addEventListeners() {
        this.addBookBtn.addEventListener("click", this.validateForm);
        this.searchInput.addEventListener("input", this.handleSearch);
    }
}
exports.BookManager = BookManager;
//# sourceMappingURL=Bookmanager.js.map