const sequelize = require("../config/database");

const BookFactory = require("../factories/book.factory");

const bookRepository = require("../repositories/book.repository");

const Author = require("../models/author.model");
const Category = require("../models/category.model");

function formatDate(date) {
  if (!date) {
    return null;
  }
  const newDate = new Date(date);
  return newDate.toISOString().split("T")[0];
}
async function createBook(data) {
  const t = await sequelize.transaction();

  try {
    let { title, isbn, publication_date, price, authorName, categoryName } =
      data;

    if (
      !title ||
      !isbn ||
      !price ||
      !authorName ||
      !authorName.trim() ||
      !categoryName ||
      !categoryName.trim()
    ) {
      throw new Error("All fields are required");
    }

    publication_date = formatDate(publication_date);

    let author = await Author.findOne({
      where: {
        name: authorName.trim(),
      },
      transaction: t,
    });
    if (!author) {
      author = await Author.create(
        {
          name: authorName.trim(),
        },
        {
          transaction: t,
        },
      );
    }
    let category = await Category.findOne({
      where: {
        category_name: categoryName.trim(),
      },
      transaction: t,
    });

    if (!category) {
      category = await Category.create(
        {
          category_name: categoryName.trim(),
        },
        {
          transaction: t,
        },
      );
    }
    const bookData = BookFactory.createBook({
      title,
      isbn,
      publication_date,
      price,
      AuthorId: author.id,
      CategoryId: category.id,
    });

    const newBook = await bookRepository.createBook(bookData, t);
    await t.commit();

    return newBook;
  } catch (err) {
    await t.rollback();

    throw err;
  }
}

async function updateBook(id, data) {
  const t = await sequelize.transaction();

  try {
    let { title, isbn, publication_date, price, authorName, categoryName } =
      data;
    if (
      !title ||
      !isbn ||
      !price ||
      !authorName ||
      !authorName.trim() ||
      !categoryName ||
      !categoryName.trim()
    ) {
      throw new Error("Author & Category required");
    }
    publication_date = formatDate(publication_date);

    const book = await bookRepository.getBookById(id);

    if (!book) {
      throw new Error("Book not found");
    }
    let author = await Author.findOne({
      where: {
        name: authorName.trim(),
      },
      transaction: t,
    });

    if (!author) {
      author = await Author.create(
        {
          name: authorName.trim(),
        },
        {
          transaction: t,
        },
      );
    }
    let category = await Category.findOne({
      where: {
        category_name: categoryName.trim(),
      },
      transaction: t,
    });

    if (!category) {
      category = await Category.create(
        {
          category_name: categoryName.trim(),
        },
        {
          transaction: t,
        },
      );
    }
    const updatedData = {
      title,
      isbn,
      publication_date,
      price,
      AuthorId: author.id,
      CategoryId: category.id,
    };

    const updatedBook = await bookRepository.updateBook(book, updatedData, t);

    await t.commit();

    return updatedBook;
  } catch (err) {
    await t.rollback();

    throw err;
  }
}
async function deleteBook(id) {
  const t = await sequelize.transaction();

  try {
    const book = await bookRepository.getBookById(id);

    if (!book) {
      throw new Error("Book not found");
    }

    await bookRepository.deleteBook(book, t);

    await t.commit();

    return true;
  } catch (err) {
    await t.rollback();

    throw err;
  }
}
async function getAllBooks() {
  try {
    const books = await bookRepository.getAllBooks();

    return books;
  } catch (err) {
    throw err;
  }
}
async function getBookById(id) {
  try {
    const book = await bookRepository.getBookById(id);

    if (!book) {
      throw new Error("Book not found");
    }

    return book;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById,
};
