import { BaseBook } from "./BaseBook.js";
export class PrintedBook extends BaseBook {
    constructor(book) {
        super(book);
        this.shippingCost = 40;
    }
    finalPrice() {
        return this.price + this.shippingCost;
    }
}
