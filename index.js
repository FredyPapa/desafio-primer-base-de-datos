//Importaciones de terceros
require('dotenv').config();

//Llamamos al servidor
const Server = require('./models/server');

const server = new Server();

server.listen();
