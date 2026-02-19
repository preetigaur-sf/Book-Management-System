import { BaseBook } from "../models/BaseBook.js";
import { Author } from "../models/Author.js";
import { Category } from "../models/Category.js";
import { Repository } from "./Repository.js";
import { Log } from "../decorators/log.js";

export class BookManager {
  private bookRepo = new Repository<BaseBook>();
  private editIndex: number | null = null;

  private tableBody!: HTMLElement;
  private bookForm!: HTMLFormElement;
  private searchInput!: HTMLInputElement;

  private titleInput!: HTMLInputElement;
  private authorInput!: HTMLInputElement;
  private isbnInput!: HTMLInputElement;
  private publicationDateInput!: HTMLInputElement;
  private genreInput!: HTMLInputElement;
  private priceInput!: HTMLInputElement;

  constructor() {
    this.cacheDOM();
    this.addEventListeners();
    this.loadBooks();
  }

  private cacheDOM(): void {
    this.tableBody = document.getElementById("tableBody")!;
    this.bookForm = document.getElementById("bookForm") as HTMLFormElement;
    this.searchInput = document.getElementById("searchInput") as HTMLInputElement;

    this.titleInput = document.getElementById("title") as HTMLInputElement;
    this.authorInput = document.getElementById("author") as HTMLInputElement;
    this.isbnInput = document.getElementById("isbn") as HTMLInputElement;
    this.publicationDateInput = document.getElementById("publicationDate") as HTMLInputElement;
    this.genreInput = document.getElementById("genre") as HTMLInputElement;
    this.priceInput = document.getElementById("price") as HTMLInputElement;
  }

  @Log
  private async loadBooks(): Promise<void> {
    try {
      const response = await fetch("/dist/data.json");
      const data = await response.json();

      this.bookRepo.clear();
      this.editIndex = null;

      data.forEach((item: any) => {
        const book = new BaseBook(
          item.title,
          new Author(item.author),
          item.isbn,
          item.publicationDate,
          new Category(item.genre),
          item.price
        );

        this.bookRepo.add(book);
      });

      this.render();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  @Log
  private handleSubmit(e: Event): void {
    e.preventDefault();

    const book = new BaseBook(
      this.titleInput.value,
      new Author(this.authorInput.value),
      this.isbnInput.value,
      this.publicationDateInput.value,
      new Category(this.genreInput.value),
      Number(this.priceInput.value)
    );

    if (this.editIndex !== null) {
      this.bookRepo.update(this.editIndex, book);
      this.editIndex = null;
    } else {
      this.bookRepo.add(book);
    }

    this.bookForm.reset();
    this.render();
  }

  @Log
  private deleteBook(index: number): void {
    this.bookRepo.remove(index);
    this.render();
  }

  @Log
  private sortBooks(
    criteria: "title" | "author" | "date",
    ascending = true
  ): void {
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

  @Log
  private handleSearch(): void {
    const query = this.searchInput.value.toLowerCase();

    const filtered = this.bookRepo.find(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.name.toLowerCase().includes(query)
    );

    this.render(filtered);
  }

  private render(books: BaseBook[] = this.bookRepo.getAll()): void {
    this.tableBody.innerHTML = "";

    books.forEach((book, index) => {
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
        <td>${book.type ?? "-"}</td>
        <td>${book.extraInfo ?? "-"}</td>
      `;

      this.tableBody.appendChild(row);
    });

    this.tableBody.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number((e.target as HTMLElement).dataset.delete);
        this.deleteBook(index);
      });
    });

    this.tableBody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number((e.target as HTMLElement).dataset.edit);
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

  private addEventListeners(): void {
    this.bookForm.addEventListener("submit", this.handleSubmit.bind(this));
    this.searchInput.addEventListener("input", this.handleSearch.bind(this));

    const sortTitleBtn = document.getElementById("sortTitle")!;
    const sortAuthorBtn = document.getElementById("sortAuthor")!;
    const sortDateBtn = document.getElementById("sortDate")!;

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
