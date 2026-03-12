import { IAuthor } from "./IAuthor.js"
import { ICategory } from "./ICategory.js"
import { IBookDetails } from "./IBookDetails.js"

export interface IBook extends IBookDetails {
  author: IAuthor
  category: ICategory
  type: string
}