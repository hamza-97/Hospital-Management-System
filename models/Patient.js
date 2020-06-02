const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  age:{
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  user:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  disease:{
    type: String,
    required: true
  }
});

mongoose.model('patients', UserSchema);