const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const routers = require('./routes/main.router')

const ensureAdminUser = require('./userController/admin/adminRole');



const allowedOrigins = ["https://linkora-ui-dashboard-jzkinp9dc-atgayans-projects.vercel.app","https://linkora-frontend-omb9uakg1-atgayans-projects.vercel.app","http://localhost:3000","http://localhost:3001"];

//  Comprehensive CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true
}));


app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// routes
app.use("/api/v1", routers);

// Ensure admin user is created and role set on server start
ensureAdminUser();
console.log("Admin user ensured.");



// listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed origins:`, allowedOrigins);
});