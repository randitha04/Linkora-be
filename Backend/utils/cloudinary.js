const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dsuvvmwp4",
  api_key: "759828189164294",
  api_secret: process.env.CLOUDINARY_API_SECRET, // Store this securely
});

module.exports = { cloudinary };
