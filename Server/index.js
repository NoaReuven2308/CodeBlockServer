const winston = require('winston');
const express = require('express');
const http = require('http');
const cors = require('cors'); 
const app = express();

app.use(cors()); 

app.use(express.static('public'));


require('./startup/db')();
require('./startup/routes')(app);
require('./startup/logging')();
require('./startup/prod')(app);

const server = http.createServer(app);
const io = require('./startup/socket')(server); 

const port = process.env.PORT || 3000;
const runningServer = server.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = { server: runningServer, app }; 
