const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  doctorphone:{
    type: String,
    required: true
  },
  doctorname:{
    type: String,
    required: true
  },
  patientphone:{
    type: String,
    required: true
  },
  patientname:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  timeslots:{
    type: String,
    required: true
  },
  remarks:{
    type: String,
    required: false
  }
});

mongoose.model('pastappointments', UserSchema);