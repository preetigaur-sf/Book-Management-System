import { IBook } from "../interfaces/IBook.js"
import { IStore } from "../interfaces/IStore.js"
import { BaseBook } from "../models/BaseBook.js"
import { BookFactory } from "../factories/BookFactory.js"
import { Logger } from "../decorators/Logger.js"

export class BookManager {
  
  
  constructor(private books: IStore<BaseBook>) {}

  @Logger
  addBook(bookData: IBook) {
    const book = BookFactory.create(bookData)
    this.books.add(book)
  }

  getBooks(): BaseBook[] {
    return this.books.getAll()
  }

  deleteBook(index: number) {
    this.books.remove(index)
  }

  sortByTitle() {
    
    const sorted = this.books.getAll().sort((a, b) =>
      a.title.localeCompare(b.title)
    )

    sorted.forEach((b, i) => {
      this.books.remove(i)
    })

    sorted.forEach((b) => this.books.add(b))
  }

  sortByAuthor() {
    
    
    const sorted = this.books.getAll().sort((a, b) =>
      a.author.name.localeCompare(b.author.name)
    )

    sorted.forEach((b, i) => this.books.remove(i))
    sorted.forEach((b) => this.books.add(b))
  }

  sortByDate() {
    
    
    const sorted = this.books.getAll().sort(
      (a, b) =>
        new Date(a.publication_date).getTime() -
        new Date(b.publication_date).getTime()
    )

    sorted.forEach((b, i) => this.books.remove(i))
    sorted.forEach((b) => this.books.add(b))
  }
}