import { PrintedBook } from "../models/PrintedBook.js";
import { EBook } from "../models/EBook.js";
export class BookFactory {
    static create(book) {
        switch (book.type) {
            case "EBook":
                return new EBook(book);
            case "Printed":
                return new PrintedBook(book);
            default:
                throw new Error("Unknown Book Type");
        }
    }
}
