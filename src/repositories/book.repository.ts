import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Book, BookRelations} from '../models';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.id,
  BookRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Book, dataSource);
  }
  async addBook(book: Book) {
    const existingBook = await this.findOne({
      where: {
        isbn: book.isbn,
      },
    });
    if (existingBook) {
      throw new Error('Book already exist');
    }
    return this.create(book);
  }

  async getBooks() {
    return this.find();
  }

  async getBookById(id: number) {
    const book = await this.findOne({
      where: {
        id,
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async updateBook(id: number, book: Partial<Book>) {
    const oldBook = await this.findById(id);
    await this.updateById(id, book);
    const newBook = await this.findById(id);
    return {
      oldBook,
      newBook,
    };
  }

  async deleteBook(id: number) {
    const book = await this.findById(id);
    await this.deleteById(id);
    return book;
  }
}
