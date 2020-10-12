require('@babel/register');
require('core-js/stable');
require('regenerator-runtime/runtime');

const Constants = require('../utils/constants').default;

const config = {
  username: Constants.database.user,
  port: Constants.database.port,
  password: Constants.database.password,
  database: Constants.database.name,
  host: Constants.database.host,
  dialect: 'postgres',
};

module.exports = config;
