const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  cnic:{
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
  speciality:{
   type: String,
   required: true 
  },

  phone:{
    type: String,
    required: true
  },
  email:{
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
  qualification:{
    type: String,
    required: true
  },
  wardnumber:{
    type: String,
    required: true
  },
  roomnumber:{
    type: String,
    required: true
  },
  starttime:{
    type: String,
    required: true
  },
  endtime:{
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
  }
});

mongoose.model('doctors', UserSchema);