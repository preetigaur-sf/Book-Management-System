import { BaseBook } from "../models/BaseBook.js"
import { PrintedBook } from "../models/PrintedBook.js"
import { EBook } from "../models/EBook.js"
import { IBook } from "../interfaces/IBook.js"

export class BookFactory {
  
  static create(book: IBook): BaseBook {
    
    switch (book.type) {
      case "EBook":
        return new EBook(book)

      case "Printed":
        return new PrintedBook(book)

      default:
        throw new Error("Unknown Book Type")
    }
  }
}