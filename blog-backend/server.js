import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import url from 'url';
import authRoutes from './routes/auth.js';  // Ensure the path is correct

dotenv.config();  // Load environment variables

// Get the directory name for ES module
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI;
// Do not log the Mongo URI for security reasons in production
if (process.env.NODE_ENV !== 'production') {
  console.log("Mongo URI is:", mongoURI);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1); // Exit if connection fails
  });

// Routes
app.use("/api/auth", authRoutes);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created");
}

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = uploadsDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Timestamp + original extension
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']; // example allowed file types
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(500).json({ message: err.message });
  }
  // Handle other errors
  return res.status(500).json({ message: "An error occurred", error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
