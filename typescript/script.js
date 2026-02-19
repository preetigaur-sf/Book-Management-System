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
class BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publicationDate = publicationDate;
        this.genre = genre;
        this.price = price;
        this.age = this.calculateAge();
    }
    calculateAge() {
        return (new Date().getFullYear() -
            new Date(this.publicationDate).getFullYear());
    }
    calculateDiscountPrice() {
        return this.price * 0.9;
    }
}
class EBook extends BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price, fileSizeMB) {
        super(title, author, isbn, publicationDate, genre, price);
        this.fileSizeMB = fileSizeMB;
    }
    calculateDiscountPrice() {
        return this.price * 0.8;
    }
}
class PrintedBook extends BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price, numPages) {
        super(title, author, isbn, publicationDate, genre, price);
        this.numPages = numPages;
    }
}
class BookManager {
    constructor() {
        this.books = [];
        this.editIndex = null;
        this.sortField = null;
        this.sortDirection = "asc";
        this.simulateServerDelay = (book) => new Promise((resolve, reject) => {
            setTimeout(() => {
                book.title && book.author.name
                    ? resolve(`Book "${book.title}" saved successfully!`)
                    : reject(new Error("Book data invalid!"));
            }, 1000);
        });
        this.validateInputs = (book) => {
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
        };
        this.handleSearch = (e) => {
            const input = e.target;
            const query = input.value.toLowerCase().trim();
            if (!query)
                return this.renderUI();
            const filtered = this.books.filter((b) => b.title.toLowerCase().includes(query) ||
                b.author.name.toLowerCase().includes(query) ||
                b.isbn.includes(query));
            this.renderUI(filtered);
        };
        this.fetchBooksFromAPI = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch("data.json");
            if (!res.ok)
                throw new Error("Failed to load JSON");
            const data = yield res.json();
            this.books = data.map((b) => Math.random() > 0.5
                ? new EBook(b.title, b.author, b.isbn, b.publicationDate, b.genre, b.price, 10)
                : new PrintedBook(b.title, b.author, b.isbn, b.publicationDate, b.genre, b.price, 200));
            this.renderUI();
        });
        this.validateForm = () => __awaiter(this, void 0, void 0, function* () {
            const bookData = {
                title: this.titleInput.value.trim(),
                author: { name: this.authorInput.value.trim() },
                isbn: this.isbnInput.value.trim(),
                publicationDate: this.publicationDateInput.value,
                genre: { name: this.genreInput.value.trim() },
                price: Number(this.priceInput.value),
            };
            try {
                this.validateInputs(bookData);
                const book = Math.random() > 0.5
                    ? new EBook(bookData.title, bookData.author, bookData.isbn, bookData.publicationDate, bookData.genre, bookData.price, 5)
                    : new PrintedBook(bookData.title, bookData.author, bookData.isbn, bookData.publicationDate, bookData.genre, bookData.price, 250);
                yield this.simulateServerDelay(book);
                if (this.editIndex === null) {
                    this.books.push(book);
                }
                else {
                    this.books[this.editIndex] = book;
                    this.editIndex = null;
                }
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
    categorizeBooksByGenre(list) {
        return list.reduce((acc, book) => {
            const genreName = book.genre.name;
            if (!acc[genreName])
                acc[genreName] = [];
            acc[genreName].push(book);
            return acc;
        }, {});
    }
    renderUI(list = this.books) {
        const grouped = this.categorizeBooksByGenre(list);
        this.renderDesktopTable(grouped);
        this.renderMobileCards(grouped);
    }
    renderDesktopTable(grouped) {
      
        this.tableBody.innerHTML = "";
        Object.keys(grouped).forEach((genre) => {
            const booksInGenre = grouped[genre];
            if (!booksInGenre)
                return;
            booksInGenre.forEach((book) => {
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
        });
    }
    renderMobileCards(grouped) {
        
        this.mobileTableBody.innerHTML = "";
        Object.keys(grouped).forEach((genre) => {
            const books = grouped[genre];
            if (!books)
                return;
            books.forEach((book) => {
                const div = document.createElement("div");
                div.innerHTML = `
          <p><strong>${book.title}</strong></p>
          <p>${book.author.name}</p>
          <p>${book.genre.name}</p>
          <p>₹ ${book.price}</p>
        `;
                this.mobileTableBody.appendChild(div);
            });
        });
    }
    addEventListeners() {
        this.addBookBtn.addEventListener("click", this.validateForm);
        this.loadJsonBtn.addEventListener("click", this.fetchBooksFromAPI);
        this.searchInput.addEventListener("input", this.handleSearch);
    }
}

