// Formal Requires
const mongoose = require('mongoose')

// User Requires
const Comment = require('./comment')

const replySchema = new mongoose.Schema({
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

})



const Reply = Comment.discriminator('Reply', replySchema)

module.exports = Reply;