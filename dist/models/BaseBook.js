export class BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publicationDate = publicationDate;
        this.genre = genre;
        this.price = price;
        this.age = this.calculateAge();
        this.type = this.determineType();
        this.extraInfo = this.generateExtraInfo();
    }
    calculateAge() {
        return (new Date().getFullYear() - new Date(this.publicationDate).getFullYear());
    }
    calculateDiscountPrice() {
        return this.price * 0.9;
    }
    determineType() {
        if (this.genre.name === "Technology" || this.genre.name === "Science") {
            return "Educational";
        }
        if (this.genre.name === "Fiction") {
            return "Entertainment";
        }
        return "General";
    }
    generateExtraInfo() {
        if (this.age >= 50) {
            return "Classic Book";
        }
        if (this.price > 500) {
            return "Printed Book";
        }
        return "EBook";
    }
}
//# sourceMappingURL=BaseBook.js.map