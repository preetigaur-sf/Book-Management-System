const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");

const BookFacade = require("./facade/book.facade");

const Author = require("./models/author.model");
const Category = require("./models/category.model");
const Book = require("./models/book.model");

const app = express();

app.use(cors());
app.use(express.json());

Author.hasMany(Book);
Book.belongsTo(Author);

Category.hasMany(Book);
Book.belongsTo(Category);

(async () => {
  try {
    await sequelize.authenticate();

    console.log("Database Connected");

    await sequelize.sync();

    console.log("Tables Synced");
  } catch (err) {
    console.error(err);
  }
})();

function sendResponse(res, status, message, data = null) {
  return res.status(status).json({
    success: status < 400,
    message,
    data,
  });
}

async function handleGet(req, res) {
  try {
    const books = await BookFacade.getAllBooks();

    return sendResponse(res, 200, "Books fetched successfully", books);
  } catch (err) {
    console.error(err);

    return sendResponse(res, 500, err.message);
  }
}

async function handleGetById(req, res) {
  try {
    const id = parseInt(req.params.id);

    const book = await BookFacade.getBookById(id);

    return sendResponse(res, 200, "Book fetched successfully", book);
  } catch (err) {
    console.error(err);

    return sendResponse(res, 500, err.message);
  }
}

async function handlePost(req, res) {
  try {
    const newBook = await BookFacade.createBook(req.body);

    return sendResponse(res, 201, "Book added successfully", newBook);
  } catch (err) {
    console.error(err);

    return sendResponse(res, 500, err.message);
  }
}

async function handlePut(req, res) {
  try {
    const id = parseInt(req.params.id);

    const updatedBook = await BookFacade.updateBook(id, req.body);

    return sendResponse(res, 200, "Book updated successfully", updatedBook);
  } catch (err) {
    console.error(err);

    return sendResponse(res, 500, err.message);
  }
}

async function handleDelete(req, res) {
  try {
    const id = parseInt(req.params.id);

    await BookFacade.deleteBook(id);

    return sendResponse(res, 200, "Book deleted successfully");
  } catch (err) {
    console.error(err);

    return sendResponse(res, 500, err.message);
  }
}

app.get("/books", handleGet);

app.get("/books/:id", handleGetById);

app.post("/books", handlePost);

app.put("/books/:id", handlePut);

app.delete("/books/:id", handleDelete);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
