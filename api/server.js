const express = require("express");
const server = express();


// middleware
server.use(express.json()); // needed to parse the JSON from the body 

module.exports = server; 