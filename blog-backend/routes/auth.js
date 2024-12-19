import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';  // Ensure correct path to User model

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate that all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token will expire in 1 hour
    });

    // Respond with success and the token
    res.status(201).json({
      message: "User created successfully! Please login.",
      token,
    });
  } catch (error) {
    // Catch any error and send a response
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

export default router;
