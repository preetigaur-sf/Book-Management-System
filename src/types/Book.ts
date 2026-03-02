import type { Author } from "./Author.js";
import type { Category } from "./Category.js";
export interface Book {
    title: string;
    isbn: string;
    publication_date: string;
    genre: Category;
    price: number;
    author: Author;
    type: string;

}