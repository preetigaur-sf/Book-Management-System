var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BookManager } from "../../src/manager/BookManager";
const manager = new BookManager();
const tableBody = document.getElementById("tableBody");
const mobileBody = document.getElementById("mobileTableBody");
const bookForm = document.getElementById("bookForm");
const searchInput = document.getElementById("searchInput");
const sortTitleBtn = document.getElementById("sortTitle");
const sortAuthorBtn = document.getElementById("sortAuthor");
const sortDateBtn = document.getElementById("sortDate");
const loadBtn = document.getElementById("loadJsonBtn");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isbnInput = document.getElementById("isbn");
const dateInput = document.getElementById("publicationDate");
const genreInput = document.getElementById("genre");
const priceInput = document.getElementById("price");
let editIndex = null;
loadBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("./books.json");
    const data = yield res.json();
    manager.loadFromJSON(data);
    render();
});
bookForm.onsubmit = (e) => {
    e.preventDefault();
    const bookData = {
        title: titleInput.value,
        author: authorInput.value,
        isbn: isbnInput.value,
        publication_date: dateInput.value,
        genre: genreInput.value,
        price: Number(priceInput.value)
    };
    if (editIndex !== null) {
        manager.update(editIndex, bookData);
        editIndex = null;
    }
    else {
        manager.add(bookData);
    }
    bookForm.reset();
    render();
};
searchInput.oninput = () => {
    manager.search(searchInput.value);
    render();
};
sortTitleBtn.onclick = () => { manager.sortByTitle(); render(); };
sortAuthorBtn.onclick = () => { manager.sortByAuthor(); render(); };
sortDateBtn.onclick = () => { manager.sortByDate(); render(); };
function render() {
    tableBody.innerHTML = "";
    mobileBody.innerHTML = "";
    manager.getAll().forEach((b, i) => {
        tableBody.innerHTML += `
      <tr>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.isbn}</td>
        <td>${b.publication_date}</td>
        <td>${b.calculateAge()}</td>
        <td>${b.genre}</td>
        <td>₹${b.applyDiscount(10)}</td>
        <td>${b.type}</td>
        <td>${b.getExtraInfo()}</td>
        <td>
          <button onclick="editBook(${i})">Edit</button>
          <button onclick="deleteBook(${i})">Delete</button>
        </td>
      </tr>
    `;
        mobileBody.innerHTML += `
      <div class="border p-3 rounded">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
        <p>${b.type} • ₹${b.applyDiscount(10)}</p>
        <p>${b.getExtraInfo()}</p>
        <button onclick="editBook(${i})">Edit</button>
        <button onclick="deleteBook(${i})">Delete</button>
      </div>
    `;
    });
}
window.editBook = (i) => {
    const b = manager.getAll()[i];
    titleInput.value = b.title;
    authorInput.value = b.author;
    isbnInput.value = b.isbn;
    dateInput.value = b.publication_date;
    genreInput.value = b.genre;
    priceInput.value = b.price.toString();
    editIndex = i;
};
window.deleteBook = (i) => {
    manager.delete(i);
    render();
};
