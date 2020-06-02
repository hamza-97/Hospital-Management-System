const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  bedid:{
    type: String,
    required: true
  },
  bednumber:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  status:{
    type: String,
    required: true
  }
});

mongoose.model('beds', UserSchema);