import { BaseBook } from "./models/BaseBook";
import { PrintedBook } from "./models/PrintedBook";
import { EBook } from "./models/EBook";
import { IBook } from "./models/IBook";

console.log("BMS compiled successfully");
let books: BaseBook[] = [];
let filteredBooks: BaseBook[] = [];

fetch("./books.json")
  .then((res: Response) => res.json())
  .then((data: IBook[]) => {
    
    books = data.map((b: IBook, i: number) =>
      i % 2 === 0
        ? new PrintedBook({ ...b, price: 500 }) // ✅ OK
        : new EBook({ ...b, price: 300 })       // ✅ OK
    );

    filteredBooks = [...books];
    console.log("Books loaded:", books);
  });