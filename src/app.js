import './setup';
import './db/database';
import server from './server';
import Constants from './utils/constants';

server.listen(Constants.port, Constants.host);

console.log(`Server is running on port: ${Constants.port}`);
