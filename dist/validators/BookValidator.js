export class BookValidator {
    static validate(book) {
        var _a;
        if (!book.title)
            throw new Error("Title required");
        if (!((_a = book.author) === null || _a === void 0 ? void 0 : _a.name))
            throw new Error("Author required");
        if (!book.isbn)
            throw new Error("ISBN required");
        if (!book.publication_date)
            throw new Error("Publication date required");
        return true;
    }
}
