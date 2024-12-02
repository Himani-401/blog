import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Signup from "./SignUp";
import BlogPosts from "./BlogPosts";

// Main App Component
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in on page load by checking for JWT token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <h1>Blog App</h1>

        {/* Conditional rendering of logout button */}
        {loggedIn && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}

        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/blog-posts" />}
          />

          {/* Signup Route */}
          <Route
            path="/signup"
            element={!loggedIn ? <Signup setLoggedIn={setLoggedIn} /> : <Navigate to="/blog-posts" />}
          />

          {/* Blog Posts Route (protected) */}
          <Route
            path="/blog-posts"
            element={loggedIn ? <BlogPosts /> : <Navigate to="/login" />}
          />

          {/* Catch-all route to redirect to login if no valid route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
