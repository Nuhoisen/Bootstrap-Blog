const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
  posterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  posterUserName: {
    type: String,
    required: true,
  },
  assocBlogPostId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Blogpost'
  },
  body: {
    type: String,
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes:{
      type: Number,
      default: 0,
      required: true,
  },

  dislikes:{
    type: Number,
    default: 0,
    required: true,
  }   
  
})



module.exports = mongoose.model('Comment', commentSchema);