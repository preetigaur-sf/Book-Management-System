import { BaseBook } from "./BaseBook.js"
import { IBook } from "../interfaces/IBook.js"

export class PrintedBook extends BaseBook {
  shippingCost: number = 40

  constructor(book: IBook) {
    super(book)
  }

  finalPrice(): number {
    return this.price + this.shippingCost
import { BaseBook } from "./BaseBook.js";
import type { Book } from "../types/Book";

export class PrintedBook extends BaseBook {
  pages: number;

  constructor(data: Book, pages = 300) {
    super(data, "Printed");
    this.pages = pages;
  }

  getExtraInfo(): string {
    return this.pages > 300 ? "Shipping ₹60" : "Shipping ₹40";
  }
}