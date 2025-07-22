const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const routers = require('./routes/main.router')


app.use(cors({origin: "http://localhost:3000",  credentials: true, })); 
app.use(cookieParser());

app.use(express.json());

// routes
app.use("/api/v1", routers);


// listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
