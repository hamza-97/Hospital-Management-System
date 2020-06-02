const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  bedid:{
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
  alloted_time:{
    type: String,
    required: true
  },
  discharge_time:{
    type: String,
    required: true
  }
});

mongoose.model('bedallotments', UserSchema);