import { BookManager } from "./manager/BookManager.js";
import { loadBooksFromAPI } from "./utils/api.js";
import type { Book } from "./types/Book";
import type { BaseBook } from "./models/BaseBook.js";

/* ---------- STATE ---------- */
const manager = new BookManager();
let editIndex: number | null = null;

/* ---------- DOM ELEMENTS ---------- */
const bookForm = document.getElementById("bookForm") as HTMLFormElement;
const loadBtn = document.getElementById("loadJsonBtn") as HTMLButtonElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;

const titleInput = document.getElementById("title") as HTMLInputElement;
const authorInput = document.getElementById("author") as HTMLInputElement;
const isbnInput = document.getElementById("isbn") as HTMLInputElement;
const dateInput = document.getElementById("publicationDate") as HTMLInputElement;
const genreInput = document.getElementById("genre") as HTMLSelectElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const bookTypeInput = document.getElementById("bookType") as HTMLSelectElement;
const extraValueInput = document.getElementById("extraValue") as HTMLInputElement;

if (!bookForm || !bookTypeInput || !extraValueInput) {
  throw new Error("Required form elements not found in HTML");
}

/* ---------- LOAD FROM API ---------- */
loadBtn.addEventListener("click", async () => {
  try {
    const books = await loadBooksFromAPI("./books.json");
    manager.loadFromJSON(books);
    render();
  } catch (err) {
    console.error(err);
    alert("Failed to load books.json");
  }
});

/* ---------- SEARCH ---------- */
searchInput.addEventListener("input", () => {
  manager.search(searchInput.value);
  render();
});

/* ---------- ADD / UPDATE ---------- */
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const bookData: Book = {
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
    type: bookTypeInput.value as "Printed" | "E-Book",
  };

  const extra = Number(extraValueInput.value);

  if (editIndex !== null) {
    manager.update(editIndex, bookData, extra);
    editIndex = null;
    submitBtn.innerText = "Add Book";
  } else {
    manager.addBook(bookData, extra);
  }

  clearForm();
  render();
});

/* ---------- RENDER ---------- */
function render(): void {
  const tbody = document.getElementById("tableBody") as HTMLTableSectionElement;
  tbody.innerHTML = "";

  manager.getAllFiltered().forEach((b: BaseBook, i: number) => {
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

    tr.querySelector(".edit-btn")!
      .addEventListener("click", () => prepareEdit(i));

    tr.querySelector(".delete-btn")!
      .addEventListener("click", () => {
        manager.deleteByIndex(i);
        render();
      });

    tbody.appendChild(tr);
  });
}

/* ---------- PREPARE EDIT ---------- */
function prepareEdit(index: number): void {
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
      ? String((b as any).pages)
      : String((b as any).fileSizeMB);

  editIndex = index;
  submitBtn.innerText = "Update Book";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- CLEAR FORM ---------- */
function clearForm(): void {
  titleInput.value = "";
  authorInput.value = "";
  isbnInput.value = "";
  dateInput.value = "";
  genreInput.value = "";
  priceInput.value = "";
  extraValueInput.value = "";
}


const sortTitleBtn = document.getElementById("sortTitle") as HTMLButtonElement;
const sortAuthorBtn = document.getElementById("sortAuthor") as HTMLButtonElement;
const sortDateBtn = document.getElementById("sortDate") as HTMLButtonElement;

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