import { PrintedBook } from "../models/PrintedBook";
import { EBook } from "../models/EBook";
let books = [];
let filteredBooks = [];
fetch("./books.json")
    .then((res) => res.json())
    .then((data) => {
    books = data.map((b, i) => i % 2 === 0
        ? new PrintedBook(Object.assign(Object.assign({}, b), { price: 500 })) // ✅ OK
        : new EBook(Object.assign(Object.assign({}, b), { price: 300 })) // ✅ OK
    );
    filteredBooks = [...books];
    console.log("Books loaded:", books);
});
