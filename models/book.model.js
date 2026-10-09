const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Book = sequelize.define("Book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isbn: {
    type: DataTypes.STRING,
  },

  publication_date: {
    type: DataTypes.DATE,
  },

  price: {
    type: DataTypes.FLOAT,
  },
});

module.exports = Book;
