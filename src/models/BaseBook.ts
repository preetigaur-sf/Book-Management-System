import { IBook } from "../interfaces/IBook.js"

export abstract class BaseBook {
  
  title: string
  author: { id: number; name: string }
  isbn: string
  publication_date: string
  category: { id: number; name: string }
  type: string
  price: number = 500

  constructor(book: IBook) {
    this.title = book.title
    this.author = book.author
    this.isbn = book.isbn
    this.publication_date = book.publication_date
    this.category = book.category
    this.type = book.type
  }

  calculateAge(): string {
    
    const d = new Date(this.publication_date)
    const t = new Date()

    let age = t.getFullYear() - d.getFullYear()

    if (
      t.getMonth() < d.getMonth() ||
      (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())
    )
      age--

    return age <= 0 ? "New" : `${age} yrs`
  }

  getDiscountPrice(percent: number = 10): number {
    return this.price - (this.price * percent) / 100
  }
}
import type { Book } from "../types/Book";
import type { Author } from "../types/Author";
import type { Category } from "../types/Category";

export abstract class BaseBook {
  title: string;
  isbn: string;
  publication_date: string;
  genre: Category;
  protected _price: number;
  author: Author;
  type: string;

  constructor(data: Book, type: string) {
    this.title = data.title;
    this.isbn = data.isbn;
    this.publication_date = data.publication_date;
    this.genre = data.genre;
    this._price = data.price;
    this.author = data.author;
    this.type = type;
  }

  calculateAge(): string {
    const published = new Date(this.publication_date);
    const today = new Date();
    let age = today.getFullYear() - published.getFullYear();

    if (
      today.getMonth() < published.getMonth() ||
      (today.getMonth() === published.getMonth() &&
        today.getDate() < published.getDate())
    ) {
      age--;
    }

    return age <= 0 ? "New" : `${age} yrs`;
  }

  get price(): number {
    return this._price;
  }
  applyDiscount(percent: number): number {
    return Number((this._price - (this._price * percent) / 100).toFixed(2));
  }

  abstract getExtraInfo(): string;
}
