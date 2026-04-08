const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const filePath = path.join(__dirname, "db.json");

app.get("/books", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data.books);
});

app.get("/books/:id", (req, res, next) => {
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath));
    const id = parseInt(req.params.id);
    const book = data.books.find((b) => b.id === id);
    if (!book) {
      throw new Error("Book Not Found");
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

app.post("/books", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const newBook = req.body;
  newBook.id = Date.now();
  data.books.push(newBook);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const id = parseInt(req.params.id);
  data.books = data.books.map((book) =>
  book.id === id ? { ...req.body, id } : book,
  );
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: "Book Updated" });
});

app.delete("/books/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const id = parseInt(req.params.id);
  data.books = data.books.filter((book) => book.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: "Book Deleted" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something Went Wrong" });
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
