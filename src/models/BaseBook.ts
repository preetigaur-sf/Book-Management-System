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