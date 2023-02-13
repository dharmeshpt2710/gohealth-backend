const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  secret: process.env.SECRET_KEY,
  dbUri: process.env.DB_URI,
};
