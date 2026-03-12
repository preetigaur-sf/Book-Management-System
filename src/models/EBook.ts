import { BaseBook } from "./BaseBook.js"
import { IBook } from "../interfaces/IBook.js"

export class EBook extends BaseBook {
  fileSize: string = "5MB"

  constructor(book: IBook) {
    super(book)
  }
}