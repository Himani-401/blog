const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require('./routes/auth'); 

const app = express();
const port = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI;
console.log("Mongo URI is:", mongoURI);

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1); 
  });


app.use('/api/auth', authRoutes); 

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created");
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
