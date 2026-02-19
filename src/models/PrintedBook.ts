import { BaseBook } from "./BaseBook.js";
import { Author } from "./Author.js";
import { Category } from "./Category.js";

export class PrintedBook extends BaseBook {
  constructor(
    title: string,
    author: Author,
    isbn: string,
    publicationDate: string,
    genre: Category,
    price: number,
    public numPages: number
  ) {
    super(title, author, isbn, publicationDate, genre, price);
  }
}
