import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import Constants from '../utils/constants';

const sequelize = new Sequelize(
  Constants.database.name,
  Constants.database.user,
  Constants.database.password, {
    host: Constants.database.host,
    port: Constants.database.port,
    dialect: 'postgres',
    pool: {
      max: 10,
      min: 0,
      acquire: 10000,
      idle: 20000,
    },
    timezone: Constants.timezone,
  },
);

const db = {
  sequelize,
  Sequelize,
  models: {},
};
const dir = path.join(__dirname, 'models');

fs.readdirSync(dir).forEach((file) => {
  const modelDir = path.join(dir, file);

  try {
    var model = require(modelDir).default(sequelize, Sequelize.DataTypes);


    db.models[model.name] = model;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
    throw err;
  }
});

Object.keys(db.models).forEach((modelName) => {
  try {
    if (db.models[modelName].associate) {
      db.models[modelName].associate(db.models);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
    throw err;
  }
});

(async () => {
  try {
    await db.sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection has been established successfully.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Unable to connect to the database: ${err}`);
  }
})();

export default db;
