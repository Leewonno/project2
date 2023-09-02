
const development = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PW,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mysql"
}

const test = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PW,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mysql"
}

const production = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PW,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mysql"
}

module.exports = { development, production, test };
