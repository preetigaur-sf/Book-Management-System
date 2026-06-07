const { Sequelize } = require("sequelize");

class Database {
  static instance;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.sequelize = new Sequelize("BMS", "root", "Vision@09", {
      host: "localhost",
      port: 3306,
      dialect: "mysql",
    });

    Database.instance = this;
  }

  getConnection() {
    return this.sequelize;
  }
}

const databaseInstance = new Database();

module.exports = databaseInstance.getConnection();