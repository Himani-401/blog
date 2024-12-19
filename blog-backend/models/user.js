import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; 

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Middleware to hash the password before saving the user
userSchema.pre('save', async function(next) {
  // Only hash the password if it's being modified (or if it's new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Pass error to next middleware (error handling)
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password); // Returns a promise
};

const User = mongoose.model('User', userSchema); 
export default User;
