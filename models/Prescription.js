const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  date:{
    type: String,
    required: true
  },
  patient:{
    type: String,
    required: true
  },
  patientname:{
    type: String,
    required: true
  },
  doctor:{
    type: String,
    required: true
  },
  doctorname:{
    type: String,
    required: true
  },
  history:{
    type: String,
    required: true
  },
  note:{
   type: String,
   required: true 
  },

  medicine:{
    type: Array,
    required: true
  }
  // dosage:{
  //   type: Array,
  //   required: true
  // },
  // frequency:{
  //   type: Array,
  //   required: true
  // },
  // days:{
  //   type: Array,
  //   required: true
  // },
  // instruction:{
  //   type: Array,
  //   required: true
  // }
});

mongoose.model('prescriptions', UserSchema);