import * as dotenv from 'dotenv';

dotenv.config();

export default class Constants {
  static env = process.env.NODE_ENV;

  static port = process.env.PORT;

  static host = process.env.HOST;

  static database = {
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  };

  static auth = {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    accessTokenLifetime: process.env.AUTH_ACCESS_TOKEN_LIFETIME,
    refreshTokenLifetime: process.env.AUTH_REFRESH_TOKEN_LIFETIME,
  }

  static mailing = {
    email: process.env.MAILING_EMAIL,
    alias: process.env.MAILING_ALIAS,
  }

  static google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  }

  static aws = {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
  }
}
