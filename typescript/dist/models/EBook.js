import { BaseBook } from "./BaseBook.js";
export class EBook extends BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price, fileSizeMB) {
        super(title, author, isbn, publicationDate, genre, price);
        this.fileSizeMB = fileSizeMB;
    }
    calculateDiscountPrice() {
        return this.price * 0.8;
    }
    getExtraInfo() {
        return `E-Book • ${this.fileSizeMB} MB`;
    }
}
//# sourceMappingURL=EBook.js.map