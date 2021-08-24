require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  APP_PORT: process.env.APP_PORT,
  APP_CLIENT_ID : process.env.APP_CLIENT_ID,
  REGION : process.env.REGION,
  USER_POOL_ID : process.env.USER_POOL_ID
};