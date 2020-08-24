const Constants = require('../utilities/constants').default;

module.exports = {
  username: Constants.database.user,
  port: Constants.database.port,
  password: Constants.database.password,
  database: Constants.database.name,
  host: Constants.database.host,
  dialect: 'postgres',
};
