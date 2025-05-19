const express = require('express');
const colors = require('colors'); 
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(colors.green(`🚀 Server is running at http://localhost:${port}`));
  console.log(colors.cyan(`🌐 Listening on port ${port}`));
  console.log(colors.yellow('🔧 Ready for requests...'));
});
