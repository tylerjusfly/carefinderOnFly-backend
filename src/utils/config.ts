require('dotenv').config();

export const dbConfiguration = {
  DatabasePassword: process.env.DATABASE_PASS,
  DatabaseUser: process.env.DATABASE_USER,
  DatabaseHost: process.env.DATABASE_HOST,
  DatabaseName: process.env.DATABASE_DATABASE,
};
