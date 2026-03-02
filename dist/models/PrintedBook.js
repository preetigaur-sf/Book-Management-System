import { BaseBook } from "./BaseBook.js";
export class PrintedBook extends BaseBook {
    constructor(data, pages = 300) {
        super(data, "Printed");
        this.pages = pages;
    }
    getExtraInfo() {
        return this.pages > 300 ? "Shipping ₹60" : "Shipping ₹40";
    }
}
