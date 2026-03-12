"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBook = void 0;
var BaseBook = /** @class */ (function () {
    function BaseBook(book) {
        this.price = 500;
        this.title = book.title;
        this.author = book.author;
        this.isbn = book.isbn;
        this.publication_date = book.publication_date;
        this.category = book.category;
        this.type = book.type;
    }
    BaseBook.prototype.calculateAge = function () {
        var d = new Date(this.publication_date);
        var t = new Date();
        var age = t.getFullYear() - d.getFullYear();
        return age <= 0 ? "New" : "".concat(age, " yrs");
    };
    BaseBook.prototype.getDiscountPrice = function (percent) {
        if (percent === void 0) { percent = 10; }
        return this.price - (this.price * percent) / 100;
    };
    return BaseBook;
}());
exports.BaseBook = BaseBook;
