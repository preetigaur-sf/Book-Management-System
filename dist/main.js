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
import { GenericStore } from "./utils/GenericStore.js";
import { BookValidator } from "./validators/BookValidator.js";
const manager = new BookManager(new GenericStore());
console.log("BMS TypeScript version started");
const bookForm = document.getElementById("BookForm");
const bookList = document.getElementById("BookList");
const modal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const submitBtn = document.getElementById("submit-btn");
let editingIndex = -1;
function renderBooks() {
    const books = manager.getBooks();
    bookList.innerHTML = "";
    books.forEach((b, i) => {
        bookList.innerHTML += `
    <tr class="border-b">
      <td>${b.title}</td>
      <td>${b.author.name}</td>
      <td>${b.isbn}</td>
      <td>${b.publication_date}</td>
      <td>${b.calculateAge()}</td>
      <td>${b.category.name}</td>
      <td>${b.type}</td>

      <td class="space-x-2">
        <button onclick="showDetails(${i})" class="text-blue-600">View</button>
        <button onclick="editBook(${i})" class="text-green-600">Edit</button>
        <button onclick="deleteBook(${i})" class="text-red-600">Delete</button>
      </td>
    </tr>
    `;
    });
}
bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById("title").value,
        author: {
            id: Date.now(),
            name: document.getElementById("author").value,
        },
        isbn: document.getElementById("isbn").value,
        publication_date: document.getElementById("publication_date").value,
        category: {
            id: Date.now(),
            name: document.getElementById("genre").value,
        },
        type: document.getElementById("type").value,
    };
    BookValidator.validate(data);
    if (editingIndex >= 0) {
        manager.deleteBook(editingIndex);
        manager.addBook(data);
        editingIndex = -1;
        submitBtn.textContent = "Add Book";
    }
    else {
        manager.addBook(data);
    }
    bookForm.reset();
    renderBooks();
});
window.loadBooksFromJSON = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("./books.json");
    const data = yield res.json();
    data.forEach((b) => manager.addBook(b));
    renderBooks();
});
window.deleteBook = (i) => {
    manager.deleteBook(i);
    renderBooks();
};
window.editBook = (i) => {
    const b = manager.getBooks()[i];
    document.getElementById("title").value = b.title;
    document.getElementById("author").value = b.author.name;
    document.getElementById("isbn").value = b.isbn;
    document.getElementById("publication_date").value =
        b.publication_date;
    document.getElementById("genre").value =
        b.category.name;
    document.getElementById("type").value = b.type;
    editingIndex = i;
    submitBtn.textContent = "Update Book";
};
window.showDetails = (i) => {
    const b = manager.getBooks()[i];
    detailContent.innerHTML = `
  <strong>Title:</strong> ${b.title}<br>
  <strong>Author:</strong> ${b.author.name}<br>
  <strong>ISBN:</strong> ${b.isbn}<br>
  <strong>Category:</strong> ${b.category.name}<br>
  <strong>Type:</strong> ${b.type}<br>
  <strong>Age:</strong> ${b.calculateAge()}<br>
  <strong>Discount Price:</strong> ${b.getDiscountPrice()}
  `;
    modal.classList.remove("hidden");
};
window.closeModal = () => {
    modal.classList.add("hidden");
};
window.sortBooksByTitle = () => {
    manager.sortByTitle();
    renderBooks();
};
window.sortBooksByAuthor = () => {
    manager.sortByAuthor();
    renderBooks();
};
window.sortBooksByDate = () => {
    manager.sortByDate();
    renderBooks();
};
