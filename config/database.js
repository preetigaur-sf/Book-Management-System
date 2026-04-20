// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("BMS", "root", "Vision@09", {
//   host: "127.0.0.1",
//   dialect: "mysql",
// });

// module.exports = sequelize;


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("BMS", "root", "root", {
  host: "localhost",
  port: 3307,  
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;