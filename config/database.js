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
const { Sequelize } = require("sequelize");

class Database{
    static instance;

    constructor(){
        if(Database.instance){
            return Database.instance;
        }
        this.sequelize = new Sequelize(
            "BMS","root","root",{
                "host":"localhost",
                "port":3307,
                "dialect":"mysql"
            }
        );
        Database.instance=this;
    }
    getConnection(){
        return this.sequelize;
    }
}

const databseInstance = new Database();

module.exports = databseInstance.getConnection();






