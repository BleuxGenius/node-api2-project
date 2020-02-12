
const server = require('./api/server.js');

server.listen(5002, () => {
    console.log(`\n*** Server Running on http://localhost:5002 ***\n`);
})