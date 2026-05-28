const BookAdapter = require("../adapters/book.adapter");

const BookService = require("../services/book.service");

const BookObserver = require("../observers/book.observer");

const LoggerObserver = require("../observers/logger.observer");

const bookObserver = new BookObserver();

const logger = new LoggerObserver();

bookObserver.subscribe(logger);

class BookFacade {
  static async createBook(data) {
    const adaptedData = BookAdapter.adapt(data);

    const newBook = await BookService.createBook(adaptedData);

    bookObserver.notify(`New book added: ${newBook.title}`);

    return newBook;
  }

  static async updateBook(id, data) {
    const adaptedData = BookAdapter.adapt(data);

    const updatedBook = await BookService.updateBook(id, adaptedData);

    return updatedBook;
  }

  static async deleteBook(id) {
    return await BookService.deleteBook(id);
  }

  static async getAllBooks() {
    return await BookService.getAllBooks();
  }

  static async getBookById(id) {
    return await BookService.getBookById(id);
  }
}

module.exports = BookFacade;
