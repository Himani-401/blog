// User Signup (POST /signup)
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
  
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
  
    try {
      await user.save();
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Send success response
      res.status(201).json({
        message: "User created successfully! Please login.",
        token, // you can send the token here or just a success message
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  });
  