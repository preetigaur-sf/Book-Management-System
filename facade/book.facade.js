const BookAdapter = require("../adapter/book.adapter");

const BookService = require("../services/book.service");

const BookObserver = require("../observers/book.observer");

const LoggerObserver = require("../observers/logger.observer");

const bookObserver = new BookObserver();

const logger = new LoggerObserver();

bookObserver.subscribe(logger);

class BookFacade {
  static async createBook(data) {
    const adaptData = BookAdapter.adapt(data);

    const newBook = await BookService.createBook(adaptData);

    bookObserver.notify(`New book added: ${newBook.title}`);

    return newBook;
  }

  static async updateBook(id, data) {
    const adaptData = BookAdapter.adapt(data);

    const updatedBook = await BookService.updateBook(id, adaptData);
    bookObserver.notify(`book updated: ${updatedBook.title}`);
    return updatedBook;
  }

  static async deleteBook(id) {
    const book = await BookService.getBookById(id);

    await BookService.deleteBook(id);

    bookObserver.notify(`Book deleted successfully: ${book.title}`);

    return true;
  }

  static async getAllBooks() {
    return await BookService.getAllBooks();
  }

  static async getBookById(id) {
    return await BookService.getBookById(id);
  }
}

module.exports = BookFacade;
