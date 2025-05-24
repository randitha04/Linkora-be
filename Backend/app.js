const express = require("express");
const cors = require("cors");
require('colors');  

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const Routers = require('./src/routes/main.router');

app.use('/api/vi/auth', Routers);

app.get("/test", (req, res) => {
  res.status(200).json({ message: 'Fetch current user logic goes here.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
