import { IBook } from "../interfaces/IBook.js"


export class BookValidator {

  static validate(book: IBook): boolean {
    
    
    if (!book.title) throw new Error("Title required")
    if (!book.author?.name) throw new Error("Author required")
    if (!book.isbn) throw new Error("ISBN required")
    if (!book.publication_date) throw new Error("Publication date required")

    return true
  }
}