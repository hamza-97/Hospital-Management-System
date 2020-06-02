const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  type:{
    type: String,
    required: true
  },
  description:{
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
  date:{
    type: String,
    required: true
  }
});

mongoose.model('reports', UserSchema);