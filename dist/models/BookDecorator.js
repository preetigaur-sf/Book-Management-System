export class BookDecorator {
    constructor(book) {
        this.book = book;
    }
    get title() { return this.book.title; }
    get author() { return this.book.author; }
    get isbn() { return this.book.isbn; }
    get publicationDate() { return this.book.publicationDate; }
    get genre() { return this.book.genre; }
    get price() { return this.book.price; }
    get age() { return this.book.age; }
}
//# sourceMappingURL=BookDecorator.js.map