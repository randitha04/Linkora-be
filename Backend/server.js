// server.js
const http = require('http');
const app = require('./app');
const { initSocket } = require('./src/config/socket');

const server = http.createServer(app); 


server.listen(5000, () => {
  console.log('Server running on port 5000');
});
