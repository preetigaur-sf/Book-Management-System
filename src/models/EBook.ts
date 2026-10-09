import { BaseBook } from "./BaseBook.js"
import { IBook } from "../interfaces/IBook.js"

export class EBook extends BaseBook {
  fileSize: string = "5MB"

  constructor(book: IBook) {
    super(book)
import { BaseBook } from "./BaseBook.js";
import type { Book } from "../types/Book";

export class EBook extends BaseBook {
  fileSizeMB: number;

  constructor(data: Book, fileSizeMB = 5) {
    super(data, "E-Book");
    this.fileSizeMB = fileSizeMB;
  }

  getExtraInfo(): string {
    return `File Size ${this.fileSizeMB}MB`;
  }
}