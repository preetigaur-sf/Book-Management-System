"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintedBook = void 0;
const BaseBook_1 = require("./BaseBook");
class PrintedBook extends BaseBook_1.BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price, numPages) {
        super(title, author, isbn, publicationDate, genre, price);
        this.numPages = numPages;
    }
}
exports.PrintedBook = PrintedBook;
//# sourceMappingURL=PrintedBook.js.map