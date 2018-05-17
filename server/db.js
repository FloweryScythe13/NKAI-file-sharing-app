const Sequelize = require('sequelize');
const path = require('path');

const userModel = require('./models/user');

function connectToDb() {
  let dbPath = path.join(__dirname, '..', 'data/db', 'development.sqlite');
  return new Sequelize({
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 1000
    },
    // SQLite only
    storage: dbPath
  });
}

class Db {
  constructor() {
    this.connection = connectToDb();
    let user = userModel(this.connection);
    
    this.models = {
      user
    };
  }
  transaction() {
    return this.connection.transaction(...arguments);
  }
  query() {
    return this.connection.query(...arguments);
  }
}

Db.instance = new Db();

module.exports = Db;