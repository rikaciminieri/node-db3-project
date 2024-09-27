const express = require('express');
const server = express();

const SchemeRouter = require('./schemes/scheme-router.js');


server.use(express.json());
server.use('/api/schemes', SchemeRouter);

module.exports = server;