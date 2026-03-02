import { BaseBook } from "./BaseBook.js";
export class EBook extends BaseBook {
    constructor(data, fileSizeMB = 5) {
        super(data, "E-Book");
        this.fileSizeMB = fileSizeMB;
    }
    getExtraInfo() {
        return `File Size ${this.fileSizeMB}MB`;
    }
}
