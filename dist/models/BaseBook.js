export class BaseBook {
    constructor(data, type) {
        this.title = data.title;
        this.isbn = data.isbn;
        this.publication_date = data.publication_date;
        this.genre = data.genre;
        this._price = data.price;
        this.author = data.author;
        this.type = type;
    }
    calculateAge() {
        const published = new Date(this.publication_date);
        const today = new Date();
        let age = today.getFullYear() - published.getFullYear();
        if (today.getMonth() < published.getMonth() ||
            (today.getMonth() === published.getMonth() &&
                today.getDate() < published.getDate())) {
            age--;
        }
        return age <= 0 ? "New" : `${age} yrs`;
    }
    get price() {
        return this._price;
    }
    applyDiscount(percent) {
        return Number((this._price - (this._price * percent) / 100).toFixed(2));
    }
}
