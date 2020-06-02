const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  category:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  }
});

mongoose.model('bedcategories', UserSchema);