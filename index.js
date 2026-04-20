// const express = require("express");
// const cors = require("cors");
// const sequelize = require("./config/database");
//
// const Author = require("./models/author.model");
// const Category = require("./models/category.model");
// const Book = require("./models/book.model");
//
// const app = express();
//
// app.use(cors());
// app.use(express.json());
//
// Author.hasMany(Book);
// Book.belongsTo(Author);
//
// Category.hasMany(Book);
// Book.belongsTo(Category);
//
// sequelize
// .authenticate()
// .then(() => {
// console.log("database connected");
// return sequelize.sync();
// })
// .then(() => {
// console.log("All Tables created");
// })
// .catch((err) => {
// console.error(err);
// });
//
// app.post("/books", (req, res) => {
// let { title, isbn, publication_date, price, authorName, categoryName } =
// req.body;
//
// if (publication_date && publication_date.includes("-")) {
// const parts = publication_date.split("-");
// if (parts[0].length === 2) {
// publication_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
// }
// }
//
// let saveAuthor;
// let saveCategory;
//
// Author.findOne({ where: { name: authorName } })
// .then((author) => {
// if (author) {
// saveAuthor = author;
// return author;
// } else {
// return Author.create({ name: authorName });
// }
// })
// .then((author) => {
// saveAuthor = author;
// return Category.findOne({ where: { category_name: categoryName } });
// })
// .then((category) => {
// if (category) {
// saveCategory = category;
// return category;
// } else {
// return Category.create({ category_name: categoryName });
// }
// })
// .then((category) => {
// saveCategory = category;
// return Book.create({
// title,
// isbn,
// publication_date,
// price,
// AuthorId: saveAuthor.id,
// CategoryId: saveCategory.id,
// });
// })
// .then((newBook) => {
// res.status(201).json(newBook);
// })
// .catch((err) => {
// res.status(500).json({ error: err.message });
// });
// });
//
// app.get("/books", (req, res) => {
// Book.findAll({
// include: [Author, Category],
// })
// .then((books) => {
// const formatted = books.map((b) => ({
// ...b.toJSON(),
// publication_date: b.publication_date
// ? b.publication_date.toISOString().split("T")[0]
// : null,
// }));
// res.json(formatted);
// })
// .catch((err) => {
// res.status(500).json({ error: err.message });
// });
// });
//
// app.get("/books/:id", (req, res) => {
// const id = req.params.id;
//
// Book.findByPk(id, {
// include: [Author, Category],
// })
// .then((book) => {
// if (!book) {
// return res.status(404).json({ message: "Book not found" });
// }
//
// const formatted = {
// ...book.toJSON(),
// publication_date: book.publication_date
// ? book.publication_date.toISOString().split("T")[0]
// : null,
// };
//
// res.json(formatted);
// })
// .catch((err) => {
// res.status(500).json({ error: err.message });
// });
// });
//
// app.put("/books/:id", (req, res) => {
// const id = req.params.id;
// let { title, isbn, publication_date, price, authorName, categoryName } =
// req.body;
//
// if (publication_date && publication_date.includes("-")) {
// const parts = publication_date.split("-");
// if (parts[0].length === 2) {
// publication_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
// }
// }
//
// let saveAuthor;
// let saveCategory;
//
// Author.findOne({ where: { name: authorName } })
// .then((author) => {
// if (author) {
// saveAuthor = author;
// return author;
// } else {
// return Author.create({ name: authorName });
// }
// })
// .then((author) => {
// saveAuthor = author;
// return Category.findOne({ where: { category_name: categoryName } });
// })
// .then((category) => {
// if (category) {
// saveCategory = category;
// return category;
// } else {
// return Category.create({ category_name: categoryName });
// }
// })
// .then((category) => {
// saveCategory = category;
// return Book.findByPk(id);
// })
// .then((book) => {
// if (!book) {
// return res.status(404).json({ message: "Book not found" });
// }
//
// return book.update({
// title,
// isbn,
// publication_date,
// price,
// AuthorId: saveAuthor.id,
// CategoryId: saveCategory.id,
// });
// })
// .then((updatedBook) => {
// if (updatedBook) {
// res.json(updatedBook);
// }
// })
// .catch((err) => {
// res.status(500).json({ error: err.message });
// });
// });
//
// app.delete("/books/:id", (req, res) => {
// const id = req.params.id;
//
// Book.findByPk(id)
// .then((book) => {
// if (!book) {
// return res.status(404).json({ message: "Book not found" });
// }
// return book.destroy();
// })
// .then(() => {
// res.json({ message: "Book deleted successfully" });
// })
// .catch((err) => {
// res.status(500).json({ error: err.message });
// });
// });
//
// app.listen(3000, () => {
// console.log("Server running on port 3000");
// }



const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

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

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected");
    return sequelize.sync();
  })
  .then(() => {
    console.log("All Tables created");
  })
  .catch((err) => {
    console.error(err);
  });
  
  app.get("/books", (req, res) => {
  Book.findAll({
    include: [
      { model: Author, attributes: ["name"] },
      { model: Category, attributes: ["category_name"] },
    ],
  })
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching books" });
    });
});

app.post("/books", (req, res) => {
  sequelize.transaction().then((t) => {

    let { title, isbn, publication_date, price, authorName, categoryName } =
      req.body;

    if (!authorName.trim() || !categoryName.trim()) {
      return t.rollback().then(() => {
        return res.status(400).json({ message: "Author and Category required" });
      });
    }

    if (publication_date) {
      let parts = publication_date.split("-");
      if (parts[0].length === 2) {
        publication_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    let saveAuthor;
    let saveCategory;

    Author.findOne({ where: { name: authorName }, transaction: t })
      .then((author) => {
        if (author) {
          saveAuthor = author;
          return author;
        } else {
          return Author.create({ name: authorName }, { transaction: t });
        }
      })
      .then((author) => {
        saveAuthor = author;
        return Category.findOne({
          where: { category_name: categoryName },
          transaction: t,
        });
      })
      .then((category) => {
        if (category) {
          saveCategory = category;
          return category;
        } else {
          return Category.create(
            { category_name: categoryName },
            { transaction: t }
          );
        }
      })
      .then((category) => {
        saveCategory = category;
        return Book.create(
          {
            title,
            isbn,
            publication_date,
            price,
            AuthorId: saveAuthor.id,
            CategoryId: saveCategory.id,
          },
          { transaction: t }
        );
      })
      .then((newBook) => {
        return t.commit().then(() => {
          res.status(201).json(newBook);
        });
      })
      .catch((err) => {
        return t.rollback().then(() => {
          console.error(err);
          res.status(500).json({ message: "error when adding book" });
        });
      });
  });
});

app.put("/books/:id", (req, res) => {
  sequelize.transaction().then((t) => {

    const id = req.params.id;

    let { title, isbn, publication_date, price, authorName, categoryName } =
      req.body;

    if (!authorName.trim() || !categoryName.trim()) {
      return t.rollback().then(() => {
        return res.status(400).json({ message: "author and category required" });
      });
    }

    if (publication_date) {
      let date = publication_date.split("-");
      if (date[0].length === 2) {
       publication_date = `${date[2]}-${date[1]}-${dat[0]}`;
      }
    }

    let saveAuthor;
    let saveCategory;

    Author.findOne({ where: { name: authorName }, transaction: t })
      .then((author) => {
        if (author) {
          saveAuthor = author;
          return author;
        } else {
          return Author.create({ name: authorName }, { transaction: t });
        }
      })
      .then((author) => {
        saveAuthor = author;
        return Category.findOne({
          where: { category_name: categoryName },
          transaction: t,
        });
      })
      .then((category) => {
        if (category) {
          saveCategory = category;
          return category;
        } else {
          return Category.create(
            { category_name: categoryName },
            { transaction: t }
          );
        }
      })
      .then((category) => {
        saveCategory = category;
        return Book.findByPk(id, { transaction: t });
      })
      .then((book) => {
        if (!book) {
          return t.rollback().then(() => {
            return res.status(404).json({ message: "book not found" });
          });
        }

        return book.update(
          {
            title,
            isbn,
            publication_date,
            price,
            AuthorId: saveAuthor.id,
            CategoryId: saveCategory.id,
          },
          { transaction: t }
        );
      })
      .then((updatedBook) => {
        return t.commit().then(() => {
          res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook,
          });
        });
      })
      .catch((err) => {
        return t.rollback().then(() => {
          console.error(err);
          res.status(500).json({ message: "error updating book" });
        });
      });
  });
});



app.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  Book.findByPk(id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "book not found" });
      }
      return book.destroy();
    })
    .then(() => {
      res.status(200).json({ message: "book deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "error deleting book" });
    });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});