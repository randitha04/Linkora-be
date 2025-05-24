const express = require("express");
const app = express();

const router = require('./routes/main.router')

// routes
app.use("/api/vi", router);

app.post('/',(res,req)=>{
       res.status(200).json({ message: 'hellow' });
})
// listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
