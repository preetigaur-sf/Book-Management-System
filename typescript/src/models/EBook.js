"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBook = void 0;
const BaseBook_1 = require("./BaseBook");
class EBook extends BaseBook_1.BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price, fileSizeMB) {
        super(title, author, isbn, publicationDate, genre, price);
        this.fileSizeMB = fileSizeMB;
    }
    calculateDiscountPrice() {
        return this.price * 0.8;
    }
}
exports.EBook = EBook;
//# sourceMappingURL=EBook.js.map