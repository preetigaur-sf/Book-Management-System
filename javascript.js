const bookForm = document.getElementById("BookForm");
const bookList = document.getElementById("BookList");
const submitBtn = document.getElementById("submit-btn");
const modal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");

let books = [];
let editingIndex = -1;

const calculateAge = (date) => {
  const d = new Date(date);
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  if (t.getMonth() < d.getMonth() ||
    (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) age--;
  return age <= 0 ? "New" : `${age} yrs`;
};

window.loadBooksFromJSON = async () => {
  const res = await fetch("books.json");
  books = await res.json();
  renderBooks();
};

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    author: author.value,
    isbn: isbn.value,
    publication_date: publication_date.value,
    genre: genre.value
  };

  if (editingIndex >= 0) {
    books[editingIndex] = data;
    editingIndex = -1;
    submitBtn.textContent = "Add Book";
  } else {
    books.push(data);
  }

  bookForm.reset();
  renderBooks();
});

const renderBooks = () => {
  bookList.innerHTML = "";
  books.forEach((b, i) => {
    bookList.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${b.title}</td>
        <td>${b.author}</td>
        <td>${b.isbn}</td>
        <td>${b.publication_date}</td>
        <td>${calculateAge(b.publication_date)}</td>
        <td>${b.genre}</td>
        <td class="space-x-2">
          <button onclick="showDetails(${i})" class="text-blue-600">View</button>
          <button onclick="editBook(${i})" class="text-green-600">Edit</button>
          <button onclick="deleteBook(${i})" class="text-red-600">Delete</button>
        </td>
      </tr>`;
  });
};

window.editBook = (i) => {
  const b = books[i];
  title.value = b.title;
  author.value = b.author;
  isbn.value = b.isbn;
  publication_date.value = b.publication_date;
  genre.value = b.genre;
  editingIndex = i;
  submitBtn.textContent = "Update Book";
};

window.deleteBook = (i) => {
  books.splice(i, 1);
  renderBooks();
};

window.showDetails = (i) => {
  const b = books[i];
  detailContent.innerHTML = `
    <strong>Title:</strong> ${b.title}<br>
    <strong>Author:</strong> ${b.author}<br>
    <strong>ISBN:</strong> ${b.isbn}<br>
    <strong>Genre:</strong> ${b.genre}<br>
    <strong>Age:</strong> ${calculateAge(b.publication_date)}
  `;
  modal.classList.remove("hidden");
};

window.closeModal = () => {
  modal.classList.add("hidden");
};

window.sortBooksByTitle = () => {
  books.sort((a, b) => a.title.localeCompare(b.title));
  renderBooks();
};

window.sortBooksByAuthor = () => {
  books.sort((a, b) => a.author.localeCompare(b.author));
  renderBooks();
};

window.sortBooksByDate = () => {
  books.sort((a, b) =>
    new Date(a.publication_date) - new Date(b.publication_date)
  );
  renderBooks();
};

loadBooksFromJSON();