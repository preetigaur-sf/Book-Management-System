import { BaseBook } from "./BaseBook.js";
export class PrintedBook extends BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price, numPages) {
        super(title, author, isbn, publicationDate, genre, price);
        this.numPages = numPages;
    }
}
//# sourceMappingURL=PrintedBook.js.map