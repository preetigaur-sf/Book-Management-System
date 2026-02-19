
import { BaseBook } from "./BaseBook.js";
import { Author } from "./Author.js";
import { Category } from "./Category.js";

export class EBook extends BaseBook {
  constructor(
    title: string,
    author: Author,
    isbn: string,
    publicationDate: string,
    genre: Category,
    price: number,
    public fileSizeMB: number
  ) {
    super(title, author, isbn, publicationDate, genre, price);
  }

  calculateDiscountPrice(): number {
    return this.price * 0.8;
  }

  getExtraInfo(): string {
    return `E-Book • ${this.fileSizeMB} MB`;
  }
}