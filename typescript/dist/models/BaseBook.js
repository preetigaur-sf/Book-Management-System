export class BaseBook {
    constructor(data, type) {
        var _a;
        this.title = data.title;
        this.author = data.author;
        this.isbn = data.isbn;
        this.publication_date = data.publication_date;
        this.genre = data.genre;
        this.price = (_a = data.price) !== null && _a !== void 0 ? _a : 0;
        this.type = type;
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
    applyDiscount(percent) {
        return +(this.price - (this.price * percent) / 100).toFixed(2);
    }
}
