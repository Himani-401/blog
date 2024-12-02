const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
    },
    content: {
      type: String,
      required: true, 
    },
    author: {
      type: String,
      required: true, 
    },
    imageUrl: {
      type: String,
      required: false,
    }
  },
  { timestamps: true } 
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
