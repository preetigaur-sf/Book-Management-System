import { BaseBook } from "./BaseBook";
import { IBook } from "./IBook";

export class PrintedBook extends BaseBook {
  pages: number;

  constructor(data: IBook, pages = 300) {
    super(data, "Printed");
    this.pages = pages;
  }

  getExtraInfo(): string {
    return this.pages > 300 ? "Shipping ₹60" : "Shipping ₹40";
  }
}