"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBook = void 0;
class BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publicationDate = publicationDate;
        this.genre = genre;
        this.price = price;
        this.age = this.calculateAge();
    }
    calculateAge() {
        return (new Date().getFullYear() -
            new Date(this.publicationDate).getFullYear());
    }
    calculateDiscountPrice() {
        return this.price * 0.9;
    }
}
exports.BaseBook = BaseBook;
//# sourceMappingURL=script.js.map