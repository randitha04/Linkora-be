const express = require("express");
const cors = require('cors');

const app = express();

const routers = require('./routes/main.router')


app.use(cors()); 

app.use(express.json());

// routes
app.use("/api/vi", routers);


// listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
