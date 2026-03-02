var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BookManager } from "./manager/BookManager.js";
import { loadBooksFromAPI } from "./utils/api.js";
/* ---------- STATE ---------- */
const manager = new BookManager();
let editIndex = null;
/* ---------- DOM ELEMENTS ---------- */
const bookForm = document.getElementById("bookForm");
const loadBtn = document.getElementById("loadJsonBtn");
const searchInput = document.getElementById("searchInput");
const submitBtn = document.getElementById("submitBtn");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isbnInput = document.getElementById("isbn");
const dateInput = document.getElementById("publicationDate");
const genreInput = document.getElementById("genre");
const priceInput = document.getElementById("price");
const bookTypeInput = document.getElementById("bookType");
const extraValueInput = document.getElementById("extraValue");
if (!bookForm || !bookTypeInput || !extraValueInput) {
    throw new Error("Required form elements not found in HTML");
}
/* ---------- LOAD FROM API ---------- */
loadBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield loadBooksFromAPI("./books.json");
        manager.loadFromJSON(books);
        render();
    }
    catch (err) {
        console.error(err);
        alert("Failed to load books.json");
    }
}));
/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", () => {
    manager.search(searchInput.value);
    render();
});
/* ---------- ADD / UPDATE ---------- */
bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bookData = {
        title: titleInput.value,
        isbn: isbnInput.value,
        publication_date: dateInput.value,
        genre: {
            id: crypto.randomUUID(),
            name: genreInput.value,
        },
        price: Number(priceInput.value),
        author: {
            id: crypto.randomUUID(),
            name: authorInput.value,
        },
        type: bookTypeInput.value,
    };
    const extra = Number(extraValueInput.value);
    if (editIndex !== null) {
        manager.update(editIndex, bookData, extra);
        editIndex = null;
        submitBtn.innerText = "Add Book";
    }
    else {
        manager.addBook(bookData, extra);
    }
    clearForm();
    render();
});
/* ---------- RENDER ---------- */
function render() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    manager.getAllFiltered().forEach((b, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${b.title}</td>
      <td>${b.author.name}</td>
      <td>${b.isbn}</td>
      <td>${b.publication_date}</td>
      <td>${b.calculateAge()}</td>
      <td>${b.genre.name}</td>
      <td>₹${b.applyDiscount(10)}</td>
      <td>${b.type}</td>
      <td>${b.getExtraInfo()}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
        tr.querySelector(".edit-btn")
            .addEventListener("click", () => prepareEdit(i));
        tr.querySelector(".delete-btn")
            .addEventListener("click", () => {
            manager.deleteByIndex(i);
            render();
        });
        tbody.appendChild(tr);
    });
}
/* ---------- PREPARE EDIT ---------- */
function prepareEdit(index) {
    const b = manager.getAllFiltered()[index];
    titleInput.value = b.title;
    authorInput.value = b.author.name;
    isbnInput.value = b.isbn;
    dateInput.value = b.publication_date;
    genreInput.value = b.genre.name;
    priceInput.value = b.price.toString();
    bookTypeInput.value = b.type;
    extraValueInput.value =
        b.type === "Printed"
            ? String(b.pages)
            : String(b.fileSizeMB);
    editIndex = index;
    submitBtn.innerText = "Update Book";
    window.scrollTo({ top: 0, behavior: "smooth" });
}
/* ---------- CLEAR FORM ---------- */
function clearForm() {
    titleInput.value = "";
    authorInput.value = "";
    isbnInput.value = "";
    dateInput.value = "";
    genreInput.value = "";
    priceInput.value = "";
    extraValueInput.value = "";
}
const sortTitleBtn = document.getElementById("sortTitle");
const sortAuthorBtn = document.getElementById("sortAuthor");
const sortDateBtn = document.getElementById("sortDate");
sortTitleBtn.addEventListener("click", () => {
    manager.sortByTitle();
    render();
});
sortAuthorBtn.addEventListener("click", () => {
    manager.sortByAuthor();
    render();
});
sortDateBtn.addEventListener("click", () => {
    manager.sortByDate();
    render();
});
