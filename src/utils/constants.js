import * as dotenv from 'dotenv';

dotenv.config();

export default class Constants {
  static env = process.env.NODE_ENV;

  static port = process.env.PORT;

  static host = `${process.env.HOST}`;

  static database = {
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  };
}
