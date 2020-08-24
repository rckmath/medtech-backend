import './setup';
import './db/database';
import server from './server';
import Constants from './utilities/constants';

server.listen(Constants.port, Constants.host);

console.log(`Server is running on port: ${Constants.port}`);
