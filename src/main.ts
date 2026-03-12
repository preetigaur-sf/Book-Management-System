import { BookManager } from "./manager/BookManager.js";
import { GenericStore } from "./utils/GenericStore.js";
import { BookValidator } from "./validators/BookValidator.js";

const manager = new BookManager(new GenericStore());

console.log("BMS TypeScript version started");

const bookForm = document.getElementById("BookForm") as HTMLFormElement;
const bookList = document.getElementById("BookList") as HTMLElement;
const modal = document.getElementById("detailModal") as HTMLElement;
const detailContent = document.getElementById("detailContent") as HTMLElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;

let editingIndex: number = -1;

function renderBooks() {
  
  const books = manager.getBooks();

  bookList.innerHTML = "";

  books.forEach((b: any, i: number) => {
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
    title: (document.getElementById("title") as HTMLInputElement).value,
    author: {
      id: Date.now(),
      name: (document.getElementById("author") as HTMLInputElement).value,
    },
    isbn: (document.getElementById("isbn") as HTMLInputElement).value,
    publication_date: (
      document.getElementById("publication_date") as HTMLInputElement
    ).value,
    category: {
      id: Date.now(),
      name: (document.getElementById("genre") as HTMLSelectElement).value,
    },
    type: (document.getElementById("type") as HTMLSelectElement).value,
  };

  BookValidator.validate(data);

  if (editingIndex >= 0) {
    manager.deleteBook(editingIndex);
    manager.addBook(data);

    editingIndex = -1;
    submitBtn.textContent = "Add Book";
  } else {
    manager.addBook(data);
  }

  bookForm.reset();
  renderBooks();
});
(window as any).loadBooksFromJSON = async () => {
  
  
  const res = await fetch("./books.json");
  const data = await res.json();

  data.forEach((b: any) => manager.addBook(b));

  renderBooks();
};
(window as any).deleteBook = (i: number) => {
  manager.deleteBook(i);
  renderBooks();
};
(window as any).editBook = (i: number) => {
  const b: any = manager.getBooks()[i];

  (document.getElementById("title") as HTMLInputElement).value = b.title;
  (document.getElementById("author") as HTMLInputElement).value = b.author.name;
  (document.getElementById("isbn") as HTMLInputElement).value = b.isbn;
  (document.getElementById("publication_date") as HTMLInputElement).value =
    b.publication_date;
  (document.getElementById("genre") as HTMLSelectElement).value =
    b.category.name;
  (document.getElementById("type") as HTMLSelectElement).value = b.type;

  editingIndex = i;
  submitBtn.textContent = "Update Book";
};
(window as any).showDetails = (i: number) => {
  const b: any = manager.getBooks()[i];

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
(window as any).closeModal = () => {
  modal.classList.add("hidden");
};
(window as any).sortBooksByTitle = () => {
  manager.sortByTitle();
  renderBooks();
};
(window as any).sortBooksByAuthor = () => {
  manager.sortByAuthor();
  renderBooks();
};
(window as any).sortBooksByDate = () => {
  manager.sortByDate();
  renderBooks();
};
