import { BookDecorator } from "./BookDecorator";
export class DiscountedBook extends BookDecorator {
    constructor(book, discount) {
        super(book);
        this.discount = discount;
    }
    get price() {
        return this.book.price * (1 - this.discount);
    }
    get extraInfo() {
        return `${this.discount * 100}% Discount`;
    }
}
//# sourceMappingURL=DiscountedBook.js.map