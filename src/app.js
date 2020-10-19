import './setup';
import './db/database';
import server from './server';
import Constants from './utils/constants';

server.listen(Constants.port, Constants.host);

// eslint-disable-next-line no-console
console.log(`Running on port: ${Constants.port}`);
