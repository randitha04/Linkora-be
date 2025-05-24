const express = require("express");
const cors = require("cors");
require('colors');  

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const Routers = require('./src/routes/main.router');

app.use('/api/vi/auth', Routers);

app.listen(5000, () => {
  console.log(
    "Server running at http://localhost:5000".bgRed.white.bold + "\n" +
    "API is ready to accept requests!".blue
  );
});
