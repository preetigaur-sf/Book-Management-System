import { BaseBook } from "./BaseBook.js";
export class EBook extends BaseBook {
    constructor(book) {
        super(book);
        this.fileSize = "5MB";
    }
}
