export class BaseBook {
    constructor(book) {
        this.price = 500;
        this.title = book.title;
        this.author = book.author;
        this.isbn = book.isbn;
        this.publication_date = book.publication_date;
        this.category = book.category;
        this.type = book.type;
    }
    calculateAge() {
        const d = new Date(this.publication_date);
        const t = new Date();
        let age = t.getFullYear() - d.getFullYear();
        if (t.getMonth() < d.getMonth() ||
            (t.getMonth() === d.getMonth() && t.getDate() < d.getDate()))
            age--;
        return age <= 0 ? "New" : `${age} yrs`;
    }
    getDiscountPrice(percent = 10) {
        return this.price - (this.price * percent) / 100;
    }
}
