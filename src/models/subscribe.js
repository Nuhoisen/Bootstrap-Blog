const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  
  first_name: {
    type: String,
    required: false
  },
  
  last_name: {
    type: String,
    required: false
  },  
})


module.exports = mongoose.model('Subscriber', subscriberSchema);