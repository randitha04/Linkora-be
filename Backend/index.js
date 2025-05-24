const express = require("express");
const app = express();

// routes
app.get("/", (req, res) => {
  res.send("Hello Choreo!");
});

// listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
