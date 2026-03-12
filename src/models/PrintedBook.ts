import { BaseBook } from "./BaseBook.js"
import { IBook } from "../interfaces/IBook.js"

export class PrintedBook extends BaseBook {
  shippingCost: number = 40

  constructor(book: IBook) {
    super(book)
  }

  finalPrice(): number {
    return this.price + this.shippingCost
  }
}