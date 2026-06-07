const Book = require("../models/book.model");
const Author = require("../models/author.model");
const Category = require("../models/category.model");

class BookRepository {

  async getAllBooks() {
    return await Book.findAll({
      include: [
        {
          model: Author,
          attributes: ["name"],
        },
        {
          model: Category,
          attributes: ["category_name"],
        },
      ],
    });
  }

  async getBookById(id) {
    return await Book.findByPk(id, {
      include: [
        {
          model: Author,
          attributes: ["name"],
        },
        {
          model: Category,
          attributes: ["category_name"],
        },
      ],
    });
  }

  async createBook(bookData, transaction) {
    return await Book.create(bookData, {
      transaction,
    });
  }

  async updateBook(book, updatedData, transaction) {
    return await book.update(updatedData, {
      transaction,
    });
  }

  async deleteBook(book, transaction) {
    return await book.destroy({
      transaction,
    });
  }

}

module.exports = new BookRepository();