import { BookManager } from "./manager/BookManager";
import { IBook } from "./models/IBook";

const manager = new BookManager();

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const mobileBody = document.getElementById("mobileTableBody") as HTMLDivElement;

const bookForm = document.getElementById("bookForm") as HTMLFormElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;

const sortTitleBtn = document.getElementById("sortTitle") as HTMLButtonElement;
const sortAuthorBtn = document.getElementById("sortAuthor") as HTMLButtonElement;
const sortDateBtn = document.getElementById("sortDate") as HTMLButtonElement;
const loadBtn = document.getElementById("loadJsonBtn") as HTMLButtonElement;

const titleInput = document.getElementById("title") as HTMLInputElement;
const authorInput = document.getElementById("author") as HTMLInputElement;
const isbnInput = document.getElementById("isbn") as HTMLInputElement;
const dateInput = document.getElementById("publicationDate") as HTMLInputElement;
const genreInput = document.getElementById("genre") as HTMLSelectElement;
const priceInput = document.getElementById("price") as HTMLInputElement;

let editIndex: number | null = null;

loadBtn.onclick = async () => {
  const res = await fetch("./books.json");
  const data: IBook[] = await res.json();
  manager.loadFromJSON(data);
  render();
};

bookForm.onsubmit = (e) => {
  e.preventDefault();

  const bookData: IBook = {
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
  } else {
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

(window as any).editBook = (i: number) => {
  const b = manager.getAll()[i];
  titleInput.value = b.title;
  authorInput.value = b.author;
  isbnInput.value = b.isbn;
  dateInput.value = b.publication_date;
  genreInput.value = b.genre;
  priceInput.value = b.price.toString();
  editIndex = i;
};

(window as any).deleteBook = (i: number) => {
  manager.delete(i);
  render();
};