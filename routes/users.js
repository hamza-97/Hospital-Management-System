const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const url = require('url');    
const tc=require("time-slots-generator");
const querystring = require('querystring')
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');




require('../models/Doctor');
const Doctor = mongoose.model('doctors');
require('../models/Patient');
const Patient = mongoose.model('patients');
require('../models/Appointment');
const Appointment = mongoose.model('appointments');
require('../models/Admin');
const Admin = mongoose.model('admins');
require('../models/Pastappointment');
const Pastappointment = mongoose.model('pastappointments');
require('../models/Bedcategory');
const Bedcategory = mongoose.model('bedcategories');   
require('../models/Bed');
const Bed = mongoose.model('beds');  
require('../models/Bedallotment');
const Bedallotment = mongoose.model('bedallotments');  
require('../models/Prescription');
const Prescription = mongoose.model('prescriptions');  
require('../models/Department');
const Department = mongoose.model('departments');  
require('../models/Report');
const Report = mongoose.model('reports');  

var patient_data;
var doctor_data;



 

  














router.get('/admin_sign_up', (req, res) => {
  res.render('users/admin_sign_up');
});

router.get('/admin_add_bed', (req, res) => {
  Bedcategory.find({},function(err, bedcategories) {
    if (!bedcategories || bedcategories === 0) {
      res.render('users/admin_add_bed', {bedcategories:false});
    } else {
        res.render('users/admin_add_bed', {bedcategories:bedcategories});
      }
      })
  });


router.post('/submit_add_bed', (req, res) => {
  console.log(req.body)
  const newUser = new Bed({
  bedid: req.body.BedCategory +"_"+req.body.BedNumber,
  category: req.body.BedCategory,
  bednumber: req.body.BedNumber,
  description: req.body.Description,
  status: "Available"
  });
  newUser.save()
    .then(user => {
      // res.send('Patient has been added successfully');
      req.flash('success_msg', 'Bed has been added successfully');
      res.redirect('/users/admin_add_bed');
      
    })
    .catch(err => {
      console.log(err);
      return;
    });
});


  // var GivenDate = appointment_data.date;
  // GivenDate = new Date(GivenDate);
  // var CurrentDate = new Date();
  // var newCurrentDate = CurrentDate.getFullYear() + "-" +(CurrentDate.getMonth() + 1) + "-" + CurrentDate.getDate();
  // var newGivenDate = GivenDate.getFullYear() + "-" +(GivenDate.getMonth() + 1) + "-" + GivenDate.getDate();

router.get('/admin_view_bed', function(req, res) {
  var CurrentDate = new Date();
  var GivenDate
  Bed.find({},function(err, files) {
    if (!files || files.length === 0) {
      
      Bedallotment.find({},function(err, allotments) {
    for(var i=0; i<allotments.length; i++){
      GivenDate = new Date(allotments[i].discharge_time);
      if(GivenDate<CurrentDate){
        Bed.findOne({ bedid: allotments[i].bedid,  status: "Alloted"}, (err, bed) => {
          if(bed!=null){
            bed.status = "Available";
            bed.save();
          }
          
        })
      }
    }
  })
      res.render('users/admin_view_bed', { beds: false });
    } else {
      Bedallotment.find({},function(err, allotments) {
    for(var i=0; i<allotments.length; i++){
      GivenDate = new Date(allotments[i].discharge_time);
      if(GivenDate<CurrentDate){
        Bed.findOne({ bedid: allotments[i].bedid,  status: "Alloted"}, (err, bed) => {
          if(bed!=null){
            bed.status = "Available";
            bed.save();
          }
          
        })
      }
    }
  })

      res.render('users/admin_view_bed', { beds: files });

    }
  })
});

router.delete('/admin_delete_bed/:id', (req, res) => {
  Bed.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Bed has been deleted successfully');
    res.redirect('/users/admin_view_bed');
  });
});


router.get('/admin_edit_bed/:id', (req, res) => {
  Bed.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_bed', {bed: user});
  });
});

router.post('/submit_edit_bed/:id', (req, res) => {
  Bed.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.bedid = req.body.BedCategory +"_"+req.body.BedNumber
    user.category = req.body.BedCategory
    user.bednumber = req.body.BedNumber
    user.description = req.body.Description
    user.status= "Available"
    user.save() 
      .then(user => {
          req.flash('success_msg', 'Bed has been edited successfully');
          res.redirect('/users/admin_view_bed');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});

router.get('/admin_add_category', (req, res) => {
  res.render('users/admin_add_category');
});




router.post('/submit_add_category', (req, res) => {
  const newUser = new Bedcategory({
  category: req.body.Category,
  description: req.body.Description
  });
  newUser.save()
    .then(user => {
      // res.send('Patient has been added successfully');
      req.flash('success_msg', 'Category has been added successfully');
      res.redirect('/users/admin_add_category');
      
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

router.get('/admin_view_category', function(req, res) {
  Bedcategory.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_category', { categories: false });
    } else {
      res.render('users/admin_view_category', { categories: files });
    }
  })
});

router.delete('/admin_delete_category/:id', (req, res) => {
  Bedcategory.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Bed Category has been deleted successfully');
    res.redirect('/users/admin_view_category');
  });
});

router.get('/admin_edit_bed_category/:id', (req, res) => {
  Bedcategory.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_category', {category: user});
  });
});

router.post('/submit_edit_category/:id', (req, res) => {
  Bedcategory.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.category = req.body.Category;
    user.description = req.body.Description;
    user.save()
      .then(user => {
          req.flash('success_msg', 'Category has been edited successfully');
          res.redirect('/users/admin_view_category');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});
    


router.get('/admin_add_allotment', (req, res) => {
  bed_filter = []
  Patient.find({},function(err,patients) {
    Bed.find({},function(err, beds) {
    if ((!patients || patients.length === 0)  && (!beds || beds.length === 0)) {
      res.render('users/admin_add_allotment', { patients: false, beds: false });
    }else if((patients.length != 0)  && (!beds || beds.length === 0)){
      res.render('users/admin_add_allotment', { patients: patients, beds: false });
    }else if((!patients || patients.length === 0)  && (beds.length != 0)){
      for(var i=0; i<beds.length; i++){
        if(beds[i].status != "Alloted"){
          bed_filter.push(beds[i])
        }
      }
      res.render('users/admin_add_allotment', { patients: false, beds: bed_filter });
    }else {
      for(var i=0; i<beds.length; i++){
        if(beds[i].status != "Alloted"){
          bed_filter.push(beds[i])
        }
      }
      res.render('users/admin_add_allotment', { patients: patients, beds: bed_filter });
    }
    })
  });
})



router.post('/submit_add_allotment', (req, res) => {
  Patient.findOne({ _id: req.body.Patient }, (err, patient) => {
    if(patient != null){
      const newUser = new Bedallotment({
      bedid: req.body.BedId,
      patient: req.body.Patient,
      patientname: patient.name,
      alloted_time: req.body.AllotedTime,
      discharge_time: req.body.DischargeTime
      });
      console.log(req.body.BedId)
      newUser.save()
        .then(user => {
          Bed.findOne({ bedid: req.body.BedId }, (err, bed) => {
            if(bed){
              bed.status = "Alloted";
              bed.save()
              .then(bed => {
                req.flash('success_msg', 'Bed Allotment has been added successfully');
                res.redirect('/users/admin_add_allotment');
              })    
            }  
          })
          // res.send('Patient has been added successfully');
          
        })
        .catch(err => {
          console.log(err);
          return;
        });
      }
    });
});



router.get('/admin_view_allotment', function(req, res) {
  Bedallotment.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_allotment', { allotments: false });
    } else {
      res.render('users/admin_view_allotment', { allotments: files });
    }
  })
});

router.delete('/admin_delete_allotment/:id', (req, res) => {
  var CurrentDate = new Date();
  var GivenDate
  Bedallotment.findOne({ _id: req.params.id }, (err, user) => {
    GivenDate = new Date(user.discharge_time);
    if(GivenDate>CurrentDate){
      Bed.findOne({ bedid : user.bedid}, (err, bed) => {
        if(bed != null){
          bed.status = "Available";
          bed.save()
          .then(bed => {
            Bedallotment.deleteOne({ _id: req.params.id }, (err, user) => {
              if (err) {
                return res.status(404).json({ err: err });
              }
            req.flash('success_msg', 'Bed Allotment has been deleted successfully');
            res.redirect('/users/admin_view_allotment');
            })
          })    
        }  
      })
    }else{
      Bedallotment.deleteOne({ _id: req.params.id }, (err, user) => {
              if (err) {
                return res.status(404).json({ err: err });
              }
            req.flash('success_msg', 'Bed Allotment has been deleted successfully');
            res.redirect('/users/admin_view_allotment');
            })

    }
    
  });
});



router.get('/admin_edit_bed_allotment/:id', (req, res) => {
  Bedallotment.findOne({ _id: req.params.id }, (err, user) => {
    if(user != null){
    res.render('users/admin_edit_allotment', {allotment: user});
    }
    // if (err) {
    //   return res.status(404).json({ err: err });
    // }
  });
});


router.post('/submit_edit_allotment/:id', (req, res) => {
  Bedallotment.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.alloted_time = req.body.AllotedTime;
    user.discharge_time = req.body.DischargeTime;
    user.save()
      .then(user => {
          req.flash('success_msg', 'Bed Allotment has been edited successfully');
          res.redirect('/users/admin_view_allotment');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});


router.get('/admin_view_prescription', function(req, res) {
  Prescription.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_prescription', {prescriptions: false });
    } else {
      res.render('users/admin_view_prescription', { prescriptions: files });
    }
  })
});
router.get('/admin_view_full_prescription/:id', function(req, res) {
  Prescription.findOne({ _id: req.params.id }, (err, user) => {
    if (!user || user.length === 0) {
      res.render('users/admin_view_full_prescription', {prescription: false });
    } else {
      res.render('users/admin_view_full_prescription', { prescription: user });
    }
  })
});

router.get('/admin_add_prescription', (req, res) => {
  Doctor.find({},function(err, doctors) {
    if (!doctors || doctors.length === 0) {
      res.render('users/admin_add_prescription', {doctors:false, patients:false});
    } else {
      Patient.find({},function(err, patients) {
        if (!patients || patients.length === 0) {
        res.render('users/admin_add_prescription', {doctors:false, patients:false});
      } else {
          res.render('users/admin_add_prescription', {doctors:doctors, patients:patients});
        }
      })
    }
  }) 
});

router.post('/submit_add_prescription', (req, res) => {
  // super_medicine_array=[]
  medicine_array = []
  if(req.body.Medicine != null){
    if(req.body.Medicine[0].length == 1){
      medicine_array.push({medicine: req.body.Medicine, dosage: req.body.Dosage, frequency: req.body.Frequency, days: req.body.Days, instruction: req.body.Instruction});

    }else{
      for(var i=0; i<req.body.Medicine.length; i++){
        medicine_array.push({medicine: req.body.Medicine[i], dosage: req.body.Dosage[i], frequency: req.body.Frequency[i], days: req.body.Days[i], instruction: req.body.Instruction[i]});
      }

    }
    
  }
  
  console.log(medicine_array)
  Doctor.findOne({ _id: req.body.Doctor }, (err, doctor) => {
    Patient.findOne({ _id: req.body.Patient }, (err, patient) => {
      if(doctor != null && patient != null){
        const newUser = new Prescription({
          date: req.body.Date,
          patient: req.body.Patient,
          patientname: patient.name,
          doctor: req.body.Doctor,
          doctorname: doctor.name,
          history: req.body.History,
          note: req.body.Note,
          medicine: medicine_array
          // dosage: req.body.Dosage,
          // frequency: req.body.Frequency,
          // days: req.body.Days,
          // instruction: req.body.Instruction
      });
      newUser.save()
        .then(user => {
          req.flash('success_msg', 'Prescription has been added successfully');
          res.redirect('/users/admin_add_prescription');  
        })
        .catch(err => {
          console.log(err);
          return;
        });

      }
    })
  })

    
});

router.delete('/admin_delete_prescription/:id', (req, res) => {
  Prescription.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Prescription has been deleted successfully');
    res.redirect('/users/admin_view_prescription');
  });
});

router.get('/admin_add_department', (req, res) => {
  res.render('users/admin_add_department');
});




router.post('/submit_add_department', (req, res) => {
  const newUser = new Department({
  name: req.body.Name,
  description: req.body.Description
  });
  newUser.save()
    .then(user => {
      // res.send('Patient has been added successfully');
      req.flash('success_msg', 'Department has been added successfully');
      res.redirect('/users/admin_add_department');
      
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

router.get('/admin_view_department', function(req, res) {
  Department.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_department', { departments: false });
    } else {
      res.render('users/admin_view_department', { departments: files });
    }
  })
});

router.delete('/admin_delete_department/:id', (req, res) => {
  Department.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Department has been deleted successfully');
    res.redirect('/users/admin_view_department');
  });
});

router.get('/admin_edit_department/:id', (req, res) => {
  Department.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_department', {department: user});
  });
});

router.post('/submit_edit_department/:id', (req, res) => {
  Department.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.name = req.body.Name;
    user.description = req.body.Description;
    user.save()
      .then(user => {
          req.flash('success_msg', 'Department has been edited successfully');
          res.redirect('/users/admin_view_department');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});

// router.get('/admin_view_', function(req, res) {
//   Prescription.find({},function(err, files) {
//     if (!files || files.length === 0) {
//       res.render('users/admin_view_prescription', {prescriptions: false });
//     } else {
//       res.render('users/admin_view_prescription', { prescriptions: files });
//     }
//   })
// });
// router.get('/admin_view_full_prescription/:id', function(req, res) {
//   Prescription.findOne({ _id: req.params.id }, (err, user) => {
//     if (!user || user.length === 0) {
//       res.render('users/admin_view_full_prescription', {prescription: false });
//     } else {
//       res.render('users/admin_view_full_prescription', { prescription: user });
//     }
//   })
// });

router.get('/admin_add_report', (req, res) => {
  Doctor.find({},function(err, doctors) {
    if (!doctors || doctors.length === 0) {
      res.render('users/admin_add_report', {doctors:false, patients:false});
    } else {
      Patient.find({},function(err, patients) {
        if (!patients || patients.length === 0) {
        res.render('users/admin_add_report', {doctors:false, patients:false});
      } else {
          res.render('users/admin_add_report', {doctors:doctors, patients:patients});
        }
      })
    }
  }) 
});

router.post('/submit_add_report', (req, res) => {
  Doctor.findOne({ _id: req.body.Doctor }, (err, doctor) => {
    Patient.findOne({ _id: req.body.Patient }, (err, patient) => {
      if(doctor != null && patient != null){
        const newUser = new Report({
          date: req.body.Date,
          patient: req.body.Patient,
          patientname: patient.name,
          doctor: req.body.Doctor,
          doctorname: doctor.name,
          description: req.body.Description,
          type: req.body.Type
      });
      newUser.save()
        .then(user => {
          req.flash('success_msg', 'Report has been added successfully');
          res.redirect('/users/admin_add_report');  
        })
        .catch(err => {
          console.log(err);
          return;
        });

      }
    })
  })
})
router.get('/admin_view_birth_report', function(req, res) {
  birth_report=[]
  Report.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_birth_report', { reports: false });
    } else {
      for(var i=0; i<files.length; i++){
        if(files[i].type == "birth"){
          birth_report.push(files[i]);
        }
      }
      res.render('users/admin_view_birth_report', { reports: birth_report });
    }
  })
});

router.get('/admin_view_operation_report', function(req, res) {
  operation_report=[]
  Report.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_operation_report', { reports: false });
    } else {
      for(var i=0; i<files.length; i++){
        if(files[i].type == "operation"){
          operation_report.push(files[i]);
        }
      }
      res.render('users/admin_view_operation_report', { reports: operation_report });
    }
  })
});

router.get('/admin_view_expire_report', function(req, res) {
  expire_report=[]
  Report.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_expire_report', { reports: false });
    } else {
      for(var i=0; i<files.length; i++){
        if(files[i].type == "expire"){
          expire_report.push(files[i]);
        }
      }
      res.render('users/admin_view_expire_report', { reports: expire_report });
    }
  })
});
router.delete('/admin_delete_birth_report/:id', (req, res) => {
  Report.deleteOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Report has been deleted successfully');
    res.redirect('/users/admin_view_birth_report');
  });
});  

router.delete('/admin_delete_operation_report/:id', (req, res) => {
  Report.deleteOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Report has been deleted successfully');
    res.redirect('/users/admin_view_operation_report');
  });
});  
router.delete('/admin_delete_expire_report/:id', (req, res) => {
  Report.deleteOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Report has been deleted successfully');
    res.redirect('/users/admin_view_expire_report');
  });
});  

router.get('/admin_edit_birth_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_birth_report', {report: user});
  });
});

router.post('/submit_edit_birth_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.date = req.body.Date;
    user.description = req.body.Description;
    user.type = req.body.Type
    user.save()
      .then(user => {
          req.flash('success_msg', 'Report has been edited successfully');
          res.redirect('/users/admin_view_birth_report');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});

router.get('/admin_edit_operation_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_operation_report', {report: user});
  });
});

router.post('/submit_edit_operation_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.date = req.body.Date;
    user.description = req.body.Description;
    user.type = req.body.Type
    user.save()
      .then(user => {
          req.flash('success_msg', 'Report has been edited successfully');
          res.redirect('/users/admin_view_operation_report');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});

router.get('/admin_edit_expire_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_expire_report', {report: user});
  });
});

router.post('/submit_edit_expire_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.date = req.body.Date;
    user.description = req.body.Description;
    user.type = req.body.Type
    user.save()
      .then(user => {
          req.flash('success_msg', 'Report has been edited successfully');
          res.redirect('/users/admin_view_expire_report');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});


router.get('/admin_dashboard', (req, res) => {
  var recent_patients = []
  Patient.find({},function(err, patients) {
    if (patients != null){
      if(patients.length<=10 )
      {
        for(var i =patients.length-1; i>=0; i--){
          recent_patients.push(patients[i])
        }
          res.render('users/admin_dashboard',{recent_patients:recent_patients});
      }else{
        for(var i =patients.length-1; i>=patients.length-11; i--){
          recent_patients.push(patients[i])
        }
        res.render('users/admin_dashboard',{recent_patients:recent_patients});
      }
    }
    }) 
});

var DischargeDate
 

var GivenDate;
var CurrentDate = new Date();
     Bedallotment.find({},function(err, allotments) {
    for(var i=0; i<allotments.length; i++){
     DischargeDate = new Date(allotments[i].discharge_time);
      if(DischargeDate<CurrentDate){
        Bed.findOne({ bedid: allotments[i].bedid,  status: "Alloted"}, (err, bed) => {
          if(bed!=null){
            bed.status = "Available";
            bed.save();
          }
          
        })
      }
    }
  })

CurrentDate.setDate(CurrentDate.getDate()-1);
Appointment.find({},function(err, appointments) {
	if (appointments != null){
		for(var i=0; i<appointments.length; i++){
			GivenDate = appointments[i].date;
			HelperDate = appointments[i].date;
			GivenDate = new Date(GivenDate);
			if(GivenDate < CurrentDate ){
				const newUser = new Pastappointment({
	  			doctorphone: appointments[i].doctorphone,
	  			doctorname: appointments[i].doctorname,
	  			patientphone: appointments[i].patientphone,
	  			patientname: appointments[i].patientname,
	  			date: appointments[i].date,
	  			timeslots: appointments[i].timeslots,
	  			remarks: appointments[i].remarks
				});
	      		newUser.save()
	        		.then(user => {
	        			console.log("appointment transferred to past appointments")
	        		})
	        		.catch(err => {
	        			console.log(err)
	          			// return;
	        		});
	        	Appointment.deleteOne({date: HelperDate}, (err, result) => {
					if (err) {
						console.log(err)
							// return;
						}
						console.log("appointment removed from upcoming appointments")
						});
			}
		}
		// check = 1;
	}
	});
		

router.post('/admin_submit_sign_in', (req, res) => {
	

  if(req.body.user == "admin"){
    Admin.findOne({ username: req.body.username}, function(err, user) {
    if(user == null) {
      req.flash('error_msg', 'Please enter valid username or password!');
      res.redirect("/")
    }else{
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      var recent_patients = []
      if(isMatch){
        Patient.find({},function(err, patients) {
        if (patients != null){
          if(patients.length<=10)
          {
            for(var i =patients.length-1; i>=0; i--){
              recent_patients.push(patients[i])
            }
            res.render('users/admin_dashboard',{recent_patients:recent_patients});
          }else{
            for(var i =patients.length-1; i>=patients.length-11; i--){
              recent_patients.push(patients[i])
            }
            res.render('users/admin_dashboard',{recent_patients:recent_patients});
          }
        }
        }) 
      }else {
        req.flash('error_msg', 'Please enter valid username or password!');
        res.redirect("/");
        }
      });
    }
    }); 
  }else if (req.body.user == "patient"){
  	Patient.findOne({ username: req.body.username}, function(err, user) {
    if(user == null) {
      req.flash('error_msg', 'Please enter valid username or password!');
      res.redirect("/")
    }else{
    	patient_data = user;
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if(isMatch){



        var upcoming_appointments =[];
		var past_appointments =[];
    	Appointment.find({},function(err, appointments) {
	    	Pastappointment.find({},function(err, pappointments) {
	    		if (appointments != null && pappointments != null){
					for(var i=0; i<appointments.length; i++){
						if(appointments[i].patientphone == user.phone){
					 		upcoming_appointments.push(appointments[i])
					}
					}
					for(var i=0; i<pappointments.length; i++){
	      				if(pappointments[i].patientphone == user.phone){
	          				past_appointments.push(pappointments[i])
	          			}
	          		}
	  				res.render('users/patient_dashboard',{patient:user, upcoming_appointments:upcoming_appointments, past_appointments:past_appointments});
	  			}else if(appointments != null && pappointments == null){
	  				for(var i=0; i<appointments.length; i++){
						if(appointments[i].patientphone == user.phone){
					 		upcoming_appointments.push(appointments[i])
					}
					}
	  				res.render('users/patient_dashboard',{patient:user, upcoming_appointments:upcoming_appointments, past_appointments:false});
	  			}else if(appointments == null && pappointments != null){
	  				for(var i=0; i<pappointments.length; i++){
						if(pappointments[i].patientphone == user.phone){
					 		past_appointments.push(pappointments[i])
					}
					}
	  				res.render('users/patient_dashboard',{patient:user, upcoming_appointments:false, past_appointments:past_appointments});
	  			}else{
	  				res.render('users/patient_dashboard',{patient:user, upcoming_appointments:false, past_appointments:false});

	  			}

	  			})
	    })

      }else {
        req.flash('error_msg', 'Please enter valid username or password!');
        res.redirect("/");
        }
      });
    }
    }); 
  }else if (req.body.user == "doctor"){
  	Doctor.findOne({ username: req.body.username}, function(err, user) {
    if(user == null) {
      req.flash('error_msg', 'Please enter valid username or password!');
      res.redirect("/")
    }else{
      doctor_data = user;
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if(isMatch){

	var upcoming_appointments =[];
	var past_appointments =[];
    Appointment.find({},function(err, appointments) {
    	Pastappointment.find({},function(err, pappointments) {
    		if (appointments != null && pappointments != null){
				for(var i=0; i<appointments.length; i++){
					if(appointments[i].doctorphone == user.phone){
				 		upcoming_appointments.push(appointments[i])
				}
				}
				for(var i=0; i<pappointments.length; i++){
      				if(pappointments[i].doctorphone == user.phone){
          				past_appointments.push(pappointments[i])
          			}
          		}
  				res.render('users/doctor_dashboard',{doctor:user, upcoming_appointments:upcoming_appointments, past_appointments:past_appointments});
  			}else if(appointments != null && pappointments == null){
  				for(var i=0; i<appointments.length; i++){
					if(appointments[i].doctorphone == doctor_data.phone){
				 		upcoming_appointments.push(appointments[i])
				}
				}
  				res.render('users/doctor_dashboard',{doctor:user, upcoming_appointments:upcoming_appointments, past_appointments:false});
  			}else if(appointments == null && pappointments != null){
  				for(var i=0; i<pappointments.length; i++){
					if(pappointments[i].doctorphone == doctor_data.phone){
				 		past_appointments.push(pappointments[i])
				}
				}
  				res.render('users/doctor_dashboard',{doctor:user, upcoming_appointments:false, past_appointments:past_appointments});
  			}else{
  				res.render('users/doctor_dashboard',{doctor:user, upcoming_appointments:false, past_appointments:false});

  			}

  			})
    	})
      }else {
        req.flash('error_msg', 'Please enter valid username or password!');
        res.redirect("/");
        }
      });
    }
    }); 
  }
});


router.post('/admin_submit_sign_up', (req, res) => {
  let errors = [];
  if(req.body.Key == "amhatanr"){
    if(req.body.Password != req.body.ConfirmPassword){
      req.flash('error_msg', 'Passwords do not match');
      res.redirect('/users/admin_sign_up');
    }else{
    Admin.findOne({username: req.body.Username})
      .then(user => {
        if(user != null){
          req.flash('error_msg', 'username already regsitered');
          res.redirect('/users/admin_sign_up');
        } else {
          const newUser = new Admin({
          email: req.body.Email,
          username: req.body.Username,
          password: req.body.Password
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/');
                })
                .catch(err => {
                  return;
                });
            });
          });
        }
      });
  }

  }else{
    req.flash('error_msg', 'Authetication Key is not valid');
    res.redirect('/users/admin_sign_up');

  }
});


router.get('/admin_add_doctor',(req,res) =>{
  Department.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_add_doctor', { departments: false });
    } else {
      res.render('users/admin_add_doctor', { departments: files });
    }
  })
});


router.get('/admin_add_patient',(req,res) =>{
  res.render('users/admin_add_patient');
});


router.post('/submit_add_doctor', (req, res) => {
  let errors = [];
  if(req.body.Password != req.body.ConfirmPassword){
   // console.log("Passwords don't match")
   // req.flash('error_msg', 'Passwords do not match');
   res.redirect('/users/admin_add_doctor');
  }
   else {
    Doctor.findOne({username: req.body.Username})
      .then(user => {
        if(user){
          req.flash('error_msg', 'This username already exists in our system');
          // console.log('this username already exists in our system');
          res.redirect('/users/admin_add_doctor');
        } else {
          Department.findOne({ _id: req.body.Department }, (err, department) => {
          const newUser = new Doctor({
          name: req.body.Name,
          cnic: req.body.CNIC,
          age: req.body.Age,
          gender: req.body.Gender,
          speciality: department.name,
          phone: req.body.Phone,
          email: req.body.Email,
          address: req.body.Address,
          username: req.body.Username,
          password: req.body.Password,
          qualification: req.body.Qualification,
          wardnumber: req.body.WardNumber,
          roomnumber: req.body.RoomNumber,
          starttime: req.body.StartTime,
          endtime: req.body.EndTime,
          user: "doctor"
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  // res.send('Doctor has been added successfully');
                  req.flash('success_msg', 'Doctor has been added successfully');
                  res.redirect('/users/admin_add_doctor');
                  
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        })
        }
      });

  }
});


router.post('/submit_add_patient', (req, res) => {
  let errors = [];
  if(req.body.Password != req.body.ConfirmPassword){
   // console.log("Passwords do not match")
   // errors.push({text:'Passwords do not match'});
   req.flash('error_msg', 'Passwords do not match');
   res.redirect('/users/admin_add_patient');
   
  }
  else {
    Patient.findOne({username: req.body.Username})
      .then(user => {
        if(user){
          req.flash('error_msg', 'This username already exists in our system');
          // console.log('This username already exists in our system');
          res.redirect('/users/admin_add_patient');
        } else {
          const newUser = new Patient({
          name: req.body.Name,
          age: req.body.Age,
          gender: req.body.Gender,
          phone: req.body.Phone,
          address: req.body.Address,
          disease: req.body.Disease,
          username: req.body.Username,
          password: req.body.Password,
          user: "patient"
          // date: 
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  // res.send('Patient has been added successfully');
                  req.flash('success_msg', 'Patient has been added successfully');
                  res.redirect('/users/admin_add_patient');
                  
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});



router.get('/admin_view_doctor', function(req, res) {
  Doctor.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_doctor', { files: false });
    } else {
      res.render('users/admin_view_doctor', { files: files });
    }
  })
});


router.get('/admin_view_patient', function(req, res) {
  Patient.find({},function(err, files) {
    if (!files || files.length === 0) {
      res.render('users/admin_view_patient', { files: false });
    } else {
      res.render('users/admin_view_patient', { files: files });
    }
  })
});


router.get('/admin_book_appointment', function(req, res) {
  Doctor.find({},function(err, doctors) {
    if (!doctors || doctors.length === 0) {
      res.render('users/admin_book_appointment', {doctors:false, patients:false});
    } else {
      Patient.find({},function(err, patients) {
        if (!patients || patients.length === 0) {
        res.render('users/admin_book_appointment', {doctors:false, patients:false});
      } else {
          res.render('users/admin_book_appointment', {doctors:doctors, patients:patients});
        }
      })
    }
  }) 
});


router.post('/submit_book_appointment', (req, res) => {
  var GivenDate = req.body.Date;
  var CurrentDate = new Date();
  CurrentDate.setDate(CurrentDate.getDate()-1);
  GivenDate = new Date(GivenDate);
  if(GivenDate > CurrentDate){
    Appointment.find({},function(err, user) {
    	Doctor.findOne({phone: req.body.DoctorPhone}, function(err, doctor){
    		Patient.findOne({phone: req.body.PatientPhone}, function(err, patient){
  			// doctor_name = doctor.name;
          if(!user || user.length === 0){
          const newUser = new Appointment({
          doctorphone: req.body.DoctorPhone,
          doctorname: doctor.name,
          patientphone: req.body.PatientPhone,
          patientname: patient.name,
          date: req.body.Date,
          timeslots: " ",
          remarks: "NA"
          });
          res.redirect('/users/admin_book_appointment_next?valid='+ JSON.stringify(newUser));
          }else{
          	var check = 0;
          	var number = 0; 
          	for(var i=0; i<user.length ;i++){
          		if (user[i].doctorphone == req.body.DoctorPhone && req.body.PatientPhone == user[i].patientphone){
          			check = 1;
          			number = i;
          		}
          	}
  			if(check == 1 && req.body.Date == user[number].date){
      			req.flash('error_msg', 'This patient already has an appointment with the same doctor on this date');
      			res.redirect('/users/admin_book_appointment');
    		}else if(check == 1 && req.body.Date != user[number].date){
      			req.flash('error_msg', 'This patient already has an appointment with the same doctor which is pending');
      			res.redirect('/users/admin_book_appointment');
  			}else{
  				const newUser = new Appointment({
  	  			doctorphone: req.body.DoctorPhone,
  	  			doctorname: doctor.name,
      			patientphone: req.body.PatientPhone,
				patientname: patient.name,
				date: req.body.Date,
				timeslots: " ",
				remarks: "NA"
				});
				res.redirect('/users/admin_book_appointment_next?valid='+ JSON.stringify(newUser));
  			}
            
          } 
          });
    	});
    });
  }else{
    req.flash('error_msg', 'You are not allowed to book an appointment on past date');
    res.redirect('/users/admin_book_appointment');
  }
  
  });


router.get('/admin_book_appointment_next', function(req, res) {
  var step_1_data = req.query.valid;
  var appointment_data = JSON.parse(step_1_data);
  var GivenDate = appointment_data.date;
  GivenDate = new Date(GivenDate);
  var CurrentDate = new Date();
  var newCurrentDate = CurrentDate.getFullYear() + "-" +(CurrentDate.getMonth() + 1) + "-" + CurrentDate.getDate();
  var newGivenDate = GivenDate.getFullYear() + "-" +(GivenDate.getMonth() + 1) + "-" + GivenDate.getDate();
  // CurrentDate.setDate(CurrentDate.getDate()-1);
  Doctor.findOne({phone: appointment_data.doctorphone}, function(err, user){
    if(user == null){
      res.render('users/admin_book_appointment_next', {timeslots: false});
    }else{
      Appointment.find({},function(err, files) {
      if (!files || files.length === 0) {
        var start_time_string = user.starttime;
        var start_time_array= start_time_string.split(':');
        var start_time_mins = (+start_time_array[0])*60 + (+start_time_array[1]);
        var end_time_string = user.endtime;
        var end_time_array= end_time_string.split(':');
        var end_time_mins = (+end_time_array[0])*60 + (+end_time_array[1]);
        if(0 < start_time_mins){
          var timeslots_hrs = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],true,"quarter");
          var timeslots_min = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],false,"quarter");
        }else{
          var timeslots_hrs = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],true,"quarter");
          var timeslots_min = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],false,"quarter");
        }
        var now = new Date();
      	var nowTime = now.getHours()*60+now.getMinutes();
        var timeslot = [] 
        for(var i = 0; i < timeslots_min.length;i++){
            if(GivenDate>CurrentDate){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            else if(newGivenDate==newCurrentDate && nowTime < timeslots_min[i]){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
        }
        if(timeslot.length == 0){
        	req.flash('error_msg', 'No timeslots available today. Select an another date');
    		res.redirect('/users/admin_book_appointment');
        }else{
        res.render('users/admin_book_appointment_next', {timeslots: timeslot, appointment: step_1_data});

        }
        } else {
          var booked_timeslots = [];
          for(var i=0; i < files.length; i++){
            if(files[i].doctorphone == appointment_data.doctorphone && files[i].date == appointment_data.date){
              booked_timeslots.push(files[i].timeslots)
            }
          }
          var start_time_string = user.starttime;
          var start_time_array= start_time_string.split(':');
          var start_time_mins = (+start_time_array[0])*60 + (+start_time_array[1]);
          var end_time_string = user.endtime;
          var end_time_array= end_time_string.split(':');
          var end_time_mins = (+end_time_array[0])*60 + (+end_time_array[1]);
          if(0 < start_time_mins){
            var timeslots_hrs = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],true,"quarter");
            var timeslots_min = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],false,"quarter");
          }else{
            var timeslots_hrs = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],true,"quarter");
            var timeslots_min = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],false,"quarter");
          }
      
          var timeslot = [] 
          var check = 0
          var now = new Date();
          var nowTime = now.getHours()*60+now.getMinutes();
          for(var i = 0; i < timeslots_min.length;i++){
            for(var j = 0; j< booked_timeslots.length; j++){
              if(booked_timeslots[j] == timeslots_hrs[timeslots_min[i]]){
                check = 1;
              }
            }
            if(check==0 && GivenDate>CurrentDate){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            else if(check==0 && newGivenDate==newCurrentDate && nowTime < timeslots_min[i]){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            check = 0;    
          }
          if(timeslot.length == 0){
        	req.flash('error_msg', 'No timeslots available today. Select an another date');
    		res.redirect('/users/admin_book_appointment');
        }else{
        res.render('users/admin_book_appointment_next', {timeslots: timeslot, appointment: step_1_data});
        	
        }
        }
      });
    }
  })
});
      

router.post('/submit_book_appointment_next/:appointment', (req, res) => {
  if(req.params.appointment != null){
    var appointment_data = JSON.parse(req.params.appointment);
    Appointment.find({},function(err, user) {
      if(!user || user.length === 0){
    	var check = 0;
      	var number = 0; 
      	for(var i=0; i<user.length ;i++){
      		if (user[i].doctorphone == appointment_data.doctorphone && appointment_data.patientphone == user[i].patientphone){
      			check = 1;
      			number = i;
      		}
      	}
		if(check == 1 && appointment_data.date == user[number].date){
  			req.flash('error_msg', 'This patient already has an appointment with the same doctor on this date');
  			res.redirect('/users/admin_book_appointment');
		}else if(check == 1 && appointment_data.date != user[number].date){
  			req.flash('error_msg', 'This patient already has an appointment with the same doctor which is pending');
  			res.redirect('/users/admin_book_appointment');
		}else{
			const newUser = new Appointment({
			doctorphone: appointment_data.doctorphone,
			doctorname: appointment_data.doctorname,
			patientphone: appointment_data.patientphone,
			patientname: appointment_data.patientname,
			date: appointment_data.date,
			timeslots: req.body.AvailableTimeslots,
			remarks: req.body.Remarks
			});
			newUser.save()
			.then(user => {
			req.flash('success_msg', 'Your appointment has been booked successfully');
			res.redirect('/users/admin_book_appointment');
			})
			.catch(err => {
			  console.log(err);
			return;
			});
			}
	  }else{
	      const newUser = new Appointment({
	      doctorphone: appointment_data.doctorphone,
	      doctorname: appointment_data.doctorname,
	      patientphone: appointment_data.patientphone,
	      patientname: appointment_data.patientname,
	      date: appointment_data.date,
	      timeslots: req.body.AvailableTimeslots,
	      remarks: req.body.Remarks
	      });
	      newUser.save()
	      .then(user => {
	        req.flash('success_msg', 'Your appointment has been booked successfully');
	        res.redirect('/users/admin_book_appointment');
	      })
	      .catch(err => {
	          console.log(err);
	        return;
	      });
	  }
	  });
  }else{
      req.flash('error_msg', 'Something went wrong, please try again');
      res.redirect('/users/admin_book_appointment');
  }
});
          

router.get('/admin_manage_booked_appointments', function(req, res) {
  Appointment.find({},function(err, appointments) {
    if (!appointments || appointments.length === 0) {
      res.render('users/admin_manage_booked_appointments', {appointments:false});
    } else {

          res.render('users/admin_manage_booked_appointments', {appointments:appointments});
      }
    })
  });



router.delete('/admin_manage_booked_appointment/:id', (req, res) => {
  Appointment.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Appointment has been cancelled successfully');
    res.redirect('/users/admin_manage_booked_appointments');
  });
});


// Logout User
router.get('/admin_logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect("/");
});

















router.get('/patient_dashboard', (req, res) => {
	if(patient_data != null){
	var upcoming_appointments =[];
	var past_appointments =[];
    Appointment.find({},function(err, appointments) {
    	Pastappointment.find({},function(err, pappointments) {
    		if (appointments != null && pappointments != null){
				for(var i=0; i<appointments.length; i++){
					if(appointments[i].patientphone == patient_data.phone){
				 		upcoming_appointments.push(appointments[i])
				}
				}
				for(var i=0; i<pappointments.length; i++){
      				if(pappointments[i].patientphone == patient_data.phone){
          				past_appointments.push(pappointments[i])
          			}
          		}
  				res.render('users/patient_dashboard',{patient:patient_data, upcoming_appointments:upcoming_appointments, past_appointments:past_appointments});
  			}else if(appointments != null && pappointments == null){
  				for(var i=0; i<appointments.length; i++){
					if(appointments[i].patientphone == patient_data.phone){
				 		upcoming_appointments.push(appointments[i])
				}
				}
  				res.render('users/patient_dashboard',{patient:patient_data, upcoming_appointments:upcoming_appointments, past_appointments:false});
  			}else if(appointments == null && pappointments != null){
  				for(var i=0; i<pappointments.length; i++){
					if(pappointments[i].patientphone == patient_data.phone){
				 		past_appointments.push(pappointments[i])
				}
				}
  				res.render('users/patient_dashboard',{patient:patient_data, upcoming_appointments:false, past_appointments:past_appointments});
  			}else{
  				res.render('users/patient_dashboard',{patient:patient_data, upcoming_appointments:false, past_appointments:false});

  			}

  			})
    })
	}else{
		res.render('users/patient_dashboard',{patient:false, upcoming_appointments:false, past_appointments:false});
	}	
});

router.get('/patient_past_appointments', function(req, res) {
	if(patient_data != null){
		var all_appointments =[];
    	Pastappointment.find({},function(err, appointments) {
    	if (appointments != null){
      	for(var i=0; i<appointments.length; i++){
      		if(appointments[i].patientphone == patient_data.phone){
        	  all_appointments.push(appointments[i])
        	}
     	 }
     	 res.render('users/patient_past_appointments',{appointments:all_appointments});
   	 	}else{
			res.render('users/patient_past_appointments',{appointments:false});
		}
    	})
		}else{
			res.render('users/patient_past_appointments',{appointments:false});
		}
});


router.get('/patient_book_appointment', function(req, res) {
	if(patient_data != null){
  	Doctor.find({},function(err, doctors) {
    if (!doctors || doctors.length === 0) {
      res.render('users/patient_book_appointment', {doctors:false});
    } else {
          res.render('users/patient_book_appointment', {doctors:doctors});
    }
  }) 
	}else{
			res.render('users/patient_book_appointment', {doctors:false});
		}
});


router.post('/patient_submit_book_appointment', (req, res) => {
  var GivenDate = req.body.Date;
  var CurrentDate = new Date();
  CurrentDate.setDate(CurrentDate.getDate()-1);
  GivenDate = new Date(GivenDate);
  if(GivenDate > CurrentDate){
    Appointment.find({},function(err, user) {
    	Doctor.findOne({phone: req.body.DoctorPhone}, function(err, doctor){
  			// doctor_name = doctor.name;
          if(!user || user.length === 0){
          const newUser = new Appointment({
          doctorphone: req.body.DoctorPhone,
          doctorname: doctor.name,
          patientphone: patient_data.phone,
          patientname: patient_data.name,
          date: req.body.Date,
          timeslots: " ",
          remarks: "NA"
          });
          res.redirect('/users/patient_book_appointment_next?valid='+ JSON.stringify(newUser));
          }else{
          	var check = 0;
          	var number = 0; 
          	for(var i=0; i<user.length ;i++){
          		if (user[i].doctorphone == req.body.DoctorPhone && patient_data.phone == user[i].patientphone){
          			check = 1;
          			number = i;
          		}
          	}
  			if(check == 1 && req.body.Date == user[number].date){
      			req.flash('error_msg', 'You already have an appointment with the same doctor on this date');
      			res.redirect('/users/patient_book_appointment');
    		}else if(check == 1 && req.body.Date != user[number].date){
      			req.flash('error_msg', 'You already have an appointment with the same doctor which is pending');
      			res.redirect('/users/patient_book_appointment');
  			}else{
  				const newUser = new Appointment({
  	  			doctorphone: req.body.DoctorPhone,
  	  			doctorname: doctor.name,
      			patientphone: patient_data.phone,
          		patientname: patient_data.name,
				date: req.body.Date,
				timeslots: " ",
				remarks: "NA"
				});
				res.redirect('/users/patient_book_appointment_next?valid='+ JSON.stringify(newUser));
  			}
            
          } 
    	});
    });
  }else{
    req.flash('error_msg', 'You are not allowed to book an appointment on past date');
    res.redirect('/users/patient_book_appointment');
  }
  
  });


router.get('/patient_book_appointment_next', function(req, res) {
  var step_1_data = req.query.valid;
  var appointment_data = JSON.parse(step_1_data);
  var GivenDate = appointment_data.date;
  GivenDate = new Date(GivenDate);
  var CurrentDate = new Date();
  var newCurrentDate = CurrentDate.getFullYear() + "-" +(CurrentDate.getMonth() + 1) + "-" + CurrentDate.getDate();
  var newGivenDate = GivenDate.getFullYear() + "-" +(GivenDate.getMonth() + 1) + "-" + GivenDate.getDate();
  // CurrentDate.setDate(CurrentDate.getDate()-1);
  Doctor.findOne({phone: appointment_data.doctorphone}, function(err, user){
    if(user == null){
      res.render('users/patient_book_appointment_next', {timeslots: false});
    }else{
      Appointment.find({},function(err, files) {
      if (!files || files.length === 0) {
        var start_time_string = user.starttime;
        var start_time_array= start_time_string.split(':');
        var start_time_mins = (+start_time_array[0])*60 + (+start_time_array[1]);
        var end_time_string = user.endtime;
        var end_time_array= end_time_string.split(':');
        var end_time_mins = (+end_time_array[0])*60 + (+end_time_array[1]);
        if(0 < start_time_mins){
          var timeslots_hrs = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],true,"quarter");
          var timeslots_min = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],false,"quarter");
        }else{
          var timeslots_hrs = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],true,"quarter");
          var timeslots_min = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],false,"quarter");
        }
        var now = new Date();
      	var nowTime = now.getHours()*60+now.getMinutes();
        var timeslot = [] 
        for(var i = 0; i < timeslots_min.length;i++){
            if(GivenDate>CurrentDate){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            else if(newGivenDate==newCurrentDate && nowTime < timeslots_min[i]){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
        }
        if(timeslot.length == 0){
        	req.flash('error_msg', 'No timeslots available today. Select an another date');
    		res.redirect('/users/patient_book_appointment');
        }else{
        res.render('users/patient_book_appointment_next', {timeslots: timeslot, appointment: step_1_data});

        }
        } else {
          var booked_timeslots = [];
          for(var i=0; i < files.length; i++){
            if(files[i].doctorphone == appointment_data.doctorphone && files[i].date == appointment_data.date){
              booked_timeslots.push(files[i].timeslots)
            }
          }
          var start_time_string = user.starttime;
          var start_time_array= start_time_string.split(':');
          var start_time_mins = (+start_time_array[0])*60 + (+start_time_array[1]);
          var end_time_string = user.endtime;
          var end_time_array= end_time_string.split(':');
          var end_time_mins = (+end_time_array[0])*60 + (+end_time_array[1]);
          if(0 < start_time_mins){
            var timeslots_hrs = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],true,"quarter");
            var timeslots_min = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],false,"quarter");
          }else{
            var timeslots_hrs = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],true,"quarter");
            var timeslots_min = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],false,"quarter");
          }
      
          var timeslot = [] 
          var check = 0
          var now = new Date();
          var nowTime = now.getHours()*60+now.getMinutes();
          for(var i = 0; i < timeslots_min.length;i++){
            for(var j = 0; j< booked_timeslots.length; j++){
              if(booked_timeslots[j] == timeslots_hrs[timeslots_min[i]]){
                check = 1;
              }
            }
            if(check==0 && GivenDate>CurrentDate){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            else if(check==0 && newGivenDate==newCurrentDate && nowTime < timeslots_min[i]){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            check = 0;    
          }
          if(timeslot.length == 0){
        	req.flash('error_msg', 'No timeslots available today. Select an another date');
    		res.redirect('/users/patient_book_appointment');
        }else{
        res.render('users/patient_book_appointment_next', {timeslots: timeslot, appointment: step_1_data});
        	
        }
        }
      });
    }
  })
});
      

router.post('/patient_submit_book_appointment_next/:appointment', (req, res) => {
  if(req.params.appointment != null){
    var appointment_data = JSON.parse(req.params.appointment);
    Appointment.find({},function(err, user) {
      if(!user || user.length === 0){
    	var check = 0;
      	var number = 0; 
      	for(var i=0; i<user.length ;i++){
      		if (user[i].doctorphone == appointment_data.doctorphone && appointment_data.patientphone == user[i].patientphone){
      			check = 1;
      			number = i;
      		}
      	}
		if(check == 1 && appointment_data.date == user[number].date){
  			req.flash('error_msg', 'You already have an appointment with the same doctor on this date');
  			res.redirect('/users/patient_book_appointment');
		}else if(check == 1 && appointment_data.date != user[number].date){
  			req.flash('error_msg', 'You already have has an appointment with the same doctor which is pending');
  			res.redirect('/users/patient_book_appointment');
		}else{
			const newUser = new Appointment({
			doctorphone: appointment_data.doctorphone,
			doctorname: appointment_data.doctorname,
			patientphone: appointment_data.patientphone,
			patientname: appointment_data.patientname,
			date: appointment_data.date,
			timeslots: req.body.AvailableTimeslots,
			remarks: req.body.Remarks
			});
			newUser.save()
			.then(user => {
			req.flash('success_msg', 'Your appointment has been booked successfully');
			res.redirect('/users/patient_book_appointment');
			})
			.catch(err => {
			  console.log(err);
			return;
			});
			}
	  }else{
	      const newUser = new Appointment({
	      doctorphone: appointment_data.doctorphone,
	      doctorname: appointment_data.doctorname,
	      patientphone: appointment_data.patientphone,
	      patientname: appointment_data.patientname,
	      date: appointment_data.date,
	      timeslots: req.body.AvailableTimeslots,
	      remarks: req.body.Remarks
	      });
	      newUser.save()
	      .then(user => {
	        req.flash('success_msg', 'Your appointment has been booked successfully');
	        res.redirect('/users/patient_book_appointment');
	      })
	      .catch(err => {
	          console.log(err);
	        return;
	      });
	  }
	  });
  }else{
      req.flash('error_msg', 'Something went wrong, please try again');
      res.redirect('/users/patient_book_appointment');
  }
});

router.get('/patient_view_bed_allotment', function(req, res) {
  patient_allotment = []
  if(patient_data != null){
    Bedallotment.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/patient_view_bed_allotment', { allotments: false });
      } else {
        for(var i=0; i<files.length; i++){
            if(patient_data._id == files[i].patient){
              patient_allotment.push(files[i]);
            }
          }
        res.render('users/patient_view_bed_allotment', { allotments: patient_allotment });
      }
    })
  }else{
    res.render('users/patient_view_bed_allotment', { allotments: false });
  }
});
router.get('/patient_view_prescription', function(req, res) {
  patient_prescription = []
  if(patient_data != null){
    Prescription.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/patient_view_prescription', {prescriptions: false });
      } else {
         for(var i=0; i<files.length; i++){
            if(patient_data._id == files[i].patient){
              patient_prescription.push(files[i]);
            }
          }
        res.render('users/patient_view_prescription', { prescriptions: patient_prescription });
      }
    })
  }else{
    res.render('users/patient_view_prescription', {prescriptions: false });
  }
});


router.get('/patient_view_full_prescription/:id', function(req, res) {
  Prescription.findOne({ _id: req.params.id }, (err, user) => {
    if (!user || user.length === 0) {
      res.render('users/patient_view_full_prescription', {prescription: false });
    } else {
      res.render('users/patient_view_full_prescription', { prescription: user });
    }
  })
});

router.get('/patient_view_report', function(req, res) {
  patient_report=[]
  if(patient_data != null){
    Report.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/patient_view_report', { reports: false });
      } else {
        for(var i=0; i<files.length; i++){
          if(files[i].patient == patient_data._id){
            patient_report.push(files[i]);
          }
        }
        res.render('users/patient_view_report', { reports: patient_report });
      }
    })
  }else{
    res.render('users/patient_view_report', { reports: false });
  }
});

// Logout User
router.get('/patient_logout', (req, res) => {
  patient_data = null;
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect("/");
});






















router.get('/doctor_dashboard', (req, res) => {
	if(doctor_data != null){
	var upcoming_appointments =[];
	var past_appointments =[];
    Appointment.find({},function(err, appointments) {
    	Pastappointment.find({},function(err, pappointments) {
    		if (appointments != null && pappointments != null){
				for(var i=0; i<appointments.length; i++){
					if(appointments[i].doctorphone == doctor_data.phone){
				 		upcoming_appointments.push(appointments[i])
				}
				}
				for(var i=0; i<pappointments.length; i++){
      				if(pappointments[i].doctorphone == doctor_data.phone){
          				past_appointments.push(pappointments[i])
          			}
          		}
  				res.render('users/doctor_dashboard',{doctor:doctor_data, upcoming_appointments:upcoming_appointments, past_appointments:past_appointments});
  			}else if(appointments != null && pappointments == null){
  				for(var i=0; i<appointments.length; i++){
					if(appointments[i].doctorphone == doctor_data.phone){
				 		upcoming_appointments.push(appointments[i])
				}
				}
  				res.render('users/doctor_dashboard',{doctor:doctor_data, upcoming_appointments:upcoming_appointments, past_appointments:false});
  			}else if(appointments == null && pappointments != null){
  				for(var i=0; i<pappointments.length; i++){
					if(pappointments[i].doctorphone == doctor_data.phone){
				 		past_appointments.push(pappointments[i])
				}
				}
  				res.render('users/doctor_dashboard',{doctor:doctor_data, upcoming_appointments:false, past_appointments:past_appointments});
  			}else{
  				res.render('users/doctor_dashboard',{doctor:doctor_data, upcoming_appointments:false, past_appointments:false});

  			}

  			})
    })
	}else{
		res.render('users/doctor_dashboard',{doctor:false, upcoming_appointments:false, past_appointments:false});
	}	
});



router.get('/doctor_upcoming_appointments', function(req, res) {
	if(doctor_data != null){
		var all_appointments =[];
    	Appointment.find({},function(err, appointments) {
    	if (appointments != null){
      	for(var i=0; i<appointments.length; i++){
      		if(appointments[i].doctorphone == doctor_data.phone){
        	  all_appointments.push(appointments[i])
        	}
     	 }
    	res.render('users/doctor_upcoming_appointments',{appointments:all_appointments});

   	 	}else{
			res.render('users/doctor_upcoming_appointments',{appointments:false});
		}
    	})
		}else{
			res.render('users/doctor_upcoming_appointments',{appointments:false});
		}
});


router.get('/doctor_past_appointments', function(req, res) {
	if(doctor_data != null){
		var all_appointments =[];
    	Pastappointment.find({},function(err, appointments) {
    	if (appointments != null){
      	for(var i=0; i<appointments.length; i++){
      		if(appointments[i].doctorphone == doctor_data.phone){
        	  all_appointments.push(appointments[i])
        	}
     	 }
    	res.render('users/doctor_past_appointments',{appointments:all_appointments}); 
   	 	}else{
			res.render('users/doctor_past_appointments',{appointments:false});
		}
    	})
		}else{
			res.render('users/doctor_past_appointments',{appointments:false});
		}
});


router.get('/doctor_book_appointment', function(req, res) {
	if(doctor_data != null){
  	Patient.find({},function(err, patients) {
    if (!patients || patients.length === 0) {
      res.render('users/doctor_book_appointment', {patients:false});
    } else {
          res.render('users/doctor_book_appointment', {patients:patients});
    }
  }) 
	}else{
			res.render('users/doctor_book_appointment', {patients:false});
		}
});



router.post('/doctor_submit_book_appointment', (req, res) => {
  var GivenDate = req.body.Date;
  var CurrentDate = new Date();
  CurrentDate.setDate(CurrentDate.getDate()-1);
  GivenDate = new Date(GivenDate);
  if(GivenDate > CurrentDate){
    Appointment.find({},function(err, user) {
    		Patient.findOne({phone: req.body.PatientPhone}, function(err, patient){
  			// doctor_name = doctor.name;
          if(!user || user.length === 0){
          const newUser = new Appointment({
          doctorphone: doctor_data.phone,
          doctorname: doctor_data.name,
          patientphone: req.body.PatientPhone,
          patientname: patient.name,
          date: req.body.Date,
          timeslots: " ",
          remarks: "NA"
          });
          res.redirect('/users/doctor_book_appointment_next?valid='+ JSON.stringify(newUser));
          }else{
          	var check = 0;
          	var number = 0; 
          	for(var i=0; i<user.length ;i++){
          		if (user[i].doctorphone == doctor_data.phone && req.body.PatientPhone == user[i].patientphone){
          			check = 1;
          			number = i;
          		}
          	}
          	// console.log(check)
  			if(check == 1 && req.body.Date == user[number].date){
      			req.flash('error_msg', 'This patient already has an appointment with you on this date');
      			res.redirect('/users/doctor_book_appointment');
    		}else if(check == 1 && req.body.Date != user[number].date){
      			req.flash('error_msg', 'This patient already has an appointment with you which is pending');
      			res.redirect('/users/doctor_book_appointment');
  			}else{
  				const newUser = new Appointment({
  	  			doctorphone: doctor_data.phone,
          		doctorname: doctor_data.name,
      			patientphone: req.body.PatientPhone,
				patientname: patient.name,
				date: req.body.Date,
				timeslots: " ",
				remarks: "NA"
				});
				res.redirect('/users/doctor_book_appointment_next?valid='+ JSON.stringify(newUser));
  			}

            
          } 
          });
    });
  }else{
    req.flash('error_msg', 'You are not allowed to book an appointment on past date');
    res.redirect('/users/doctor_book_appointment');
  }
  
  });


router.get('/doctor_book_appointment_next', function(req, res) {
  var step_1_data = req.query.valid;
  var appointment_data = JSON.parse(step_1_data);
  var GivenDate = appointment_data.date;
  GivenDate = new Date(GivenDate);
  var CurrentDate = new Date();
  var newCurrentDate = CurrentDate.getFullYear() + "-" +(CurrentDate.getMonth() + 1) + "-" + CurrentDate.getDate();
  var newGivenDate = GivenDate.getFullYear() + "-" +(GivenDate.getMonth() + 1) + "-" + GivenDate.getDate();
  // CurrentDate.setDate(CurrentDate.getDate()-1);
  // console.log(newCurrentDate)
  // console.log(newGivenDate)
  Doctor.findOne({phone: appointment_data.doctorphone}, function(err, user){
    if(user == null){
      res.render('users/doctor_book_appointment_next', {timeslots: false});
    }else{
      Appointment.find({},function(err, files) {
      if (!files || files.length === 0) {
        var start_time_string = user.starttime;
        var start_time_array= start_time_string.split(':');
        var start_time_mins = (+start_time_array[0])*60 + (+start_time_array[1]);
        var end_time_string = user.endtime;
        var end_time_array= end_time_string.split(':');
        var end_time_mins = (+end_time_array[0])*60 + (+end_time_array[1]);
        if(0 < start_time_mins){
          var timeslots_hrs = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],true,"quarter");
          var timeslots_min = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],false,"quarter");
        }else{
          var timeslots_hrs = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],true,"quarter");
          var timeslots_min = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],false,"quarter");
        }
        var now = new Date();
      	var nowTime = now.getHours()*60+now.getMinutes();
        var timeslot = [] 
        for(var i = 0; i < timeslots_min.length;i++){
            if(GivenDate>CurrentDate){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            else if(newGivenDate==newCurrentDate && nowTime < timeslots_min[i]){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
        }
        if(timeslot.length == 0){
        	req.flash('error_msg', 'No timeslots available today. Select an another date');
    		res.redirect('/users/doctor_book_appointment');
        }else{
        res.render('users/doctor_book_appointment_next', {timeslots: timeslot, appointment: step_1_data});

        }
        } else {
          var booked_timeslots = [];
          for(var i=0; i < files.length; i++){
            if(files[i].doctorphone == appointment_data.doctorphone && files[i].date == appointment_data.date){
              booked_timeslots.push(files[i].timeslots)
            }
          }
          var start_time_string = user.starttime;
          var start_time_array= start_time_string.split(':');
          var start_time_mins = (+start_time_array[0])*60 + (+start_time_array[1]);
          var end_time_string = user.endtime;
          var end_time_array= end_time_string.split(':');
          var end_time_mins = (+end_time_array[0])*60 + (+end_time_array[1]);
          if(0 < start_time_mins){
            var timeslots_hrs = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],true,"quarter");
            var timeslots_min = tc.getTimeSlots([[0,start_time_mins-'15'],[end_time_mins,1440]],false,"quarter");
          }else{
            var timeslots_hrs = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],true,"quarter");
            var timeslots_min = tc.getTimeSlots([[end_time_mins,1440+start_time_mins-15]],false,"quarter");
          }
      
          var timeslot = [] 
          var check = 0
          var now = new Date();
          var nowTime = now.getHours()*60+now.getMinutes();
          for(var i = 0; i < timeslots_min.length;i++){
            for(var j = 0; j< booked_timeslots.length; j++){
              if(booked_timeslots[j] == timeslots_hrs[timeslots_min[i]]){
                check = 1;
              }
            }
            if(check==0 && GivenDate>CurrentDate){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            else if(check==0 && newGivenDate==newCurrentDate && nowTime < timeslots_min[i]){
            	timeslot.push(timeslots_hrs[timeslots_min[i]]);
            }
            check = 0;    
          }
          if(timeslot.length == 0){
        	req.flash('error_msg', 'No timeslots available today. Select an another date');
    		res.redirect('/users/doctor_book_appointment');
        }else{
        res.render('users/doctor_book_appointment_next', {timeslots: timeslot, appointment: step_1_data});
        	
        }
        }
      });
    }
  })
});


router.post('/doctor_submit_book_appointment_next/:appointment', (req, res) => {
	var number = 0;
  if(req.params.appointment != null){
    var appointment_data = JSON.parse(req.params.appointment);
    Appointment.find({},function(err, user) {
      if(!user || user.length === 0){
    	var check = 0;
      	var number = 0; 
      	for(var i=0; i<user.length ;i++){
      		if (user[i].doctorphone == appointment_data.doctorphone && appointment_data.patientphone == user[i].patientphone){
      			check = 1;
      			number = i;
      		}
      	}
		if(check == 1 && appointment_data.date == user[number].date){
  			req.flash('error_msg', 'This patient already has an appointment with you on this date');
  			res.redirect('/users/admin_book_appointment');
		}else if(check == 1 && appointment_data.date != user[number].date){
  			req.flash('error_msg', 'This patient already has an appointment with you which is pending');
  			res.redirect('/users/admin_book_appointment');
		}else{
			const newUser = new Appointment({
			doctorphone: appointment_data.doctorphone,
			doctorname: appointment_data.doctorname,
			patientphone: appointment_data.patientphone,
			patientname: appointment_data.patientname,
			date: appointment_data.date,
			timeslots: req.body.AvailableTimeslots,
			remarks: req.body.Remarks
			});
      newUser.save()
      .then(user => {
        req.flash('success_msg', 'Your appointment has been booked successfully');
        res.redirect('/users/doctor_book_appointment');
      })
      .catch(err => {
          console.log(err);
        return;
      });
    }
  }else{
      const newUser = new Appointment({
      doctorphone: appointment_data.doctorphone,
      doctorname: appointment_data.doctorname,
      patientphone: appointment_data.patientphone,
      patientname: appointment_data.patientname,
      date: appointment_data.date,
      timeslots: req.body.AvailableTimeslots,
      remarks: req.body.Remarks
      });
      newUser.save()
      .then(user => {
        req.flash('success_msg', 'Your appointment has been booked successfully');
        res.redirect('/users/doctor_book_appointment');
      })
      .catch(err => {
          console.log(err);
        return;
      });
  }
  });
  }else{
      req.flash('error_msg', 'Something went wrong, please try again');
      res.redirect('/users/doctor_book_appointment');
  }
});


router.delete('/doctor_cancel_appointment/:id', (req, res) => {
  Appointment.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Appointment has been cancelled successfully');
    res.redirect('/users/doctor_upcoming_appointments');
  });
});

router.delete('/doctor_complete_appointment/:id', (req, res) => {
	Appointment.findOne({ _id: req.params.id }, (err, appointments) => {
	if (err) {
      return res.status(404).json({ err: err });
    }
	const newUser = new Pastappointment({
		doctorphone: appointments.doctorphone,
		doctorname: appointments.doctorname,
		patientphone: appointments.patientphone,
		patientname: appointments.patientname,
		date: appointments.date,
		timeslots: appointments.timeslots,
		remarks: appointments.remarks
	});
	newUser.save()
	.then(user => {
		console.log("appointment transferred to past appointments")
	})
	.catch(err => {
		console.log(err)
			// return;
	});
	});
  Appointment.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Appointment has been completed successfully');
    res.redirect('/users/doctor_upcoming_appointments');
  });
});







router.get('/doctor_view_prescription', function(req, res) {
  filter_prescription = []
  if(doctor_data != null){
    Prescription.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/doctor_view_prescription', {prescriptions: false });
      } else {
          for(var i=0; i<files.length; i++){
            if(doctor_data._id == files[i].doctor){
              filter_prescription.push(files[i]);
            }
          }
        res.render('users/doctor_view_prescription', { prescriptions: filter_prescription });
      }
    })
  }else{
    res.render('users/doctor_view_prescription', {prescriptions: false });
  }
});

router.get('/doctor_view_full_prescription/:id', function(req, res) {
  Prescription.findOne({ _id: req.params.id }, (err, user) => {
    if (!user || user.length === 0) {
      res.render('users/doctor_view_full_prescription', {prescription: false });
    } else {
      res.render('users/doctor_view_full_prescription', { prescription: user });
    }
  })
});

router.get('/doctor_add_prescription', (req, res) => {
  if(doctor_data != null){
    Patient.find({},function(err, patients) {
      if (!patients || patients.length === 0) {
      res.render('users/doctor_add_prescription', {doctors:doctor_data, patients:false});
    } else {
        res.render('users/doctor_add_prescription', {doctors:doctor_data, patients:patients});
      }
    })
  }else{
    res.render('users/doctor_add_prescription', {doctors:false, patients:false});
  }
});

router.post('/submit_doctor_add_prescription', (req, res) => {
  // super_medicine_array=[]
  medicine_array = []
  if(req.body.Medicine != null){
    if(req.body.Medicine[0].length == 1){
      medicine_array.push({medicine: req.body.Medicine, dosage: req.body.Dosage, frequency: req.body.Frequency, days: req.body.Days, instruction: req.body.Instruction});

    }else{
      for(var i=0; i<req.body.Medicine.length; i++){
        medicine_array.push({medicine: req.body.Medicine[i], dosage: req.body.Dosage[i], frequency: req.body.Frequency[i], days: req.body.Days[i], instruction: req.body.Instruction[i]});
      }

    }
    
  }
  
  console.log(medicine_array)
  Doctor.findOne({ _id: req.body.Doctor }, (err, doctor) => {
    Patient.findOne({ _id: req.body.Patient }, (err, patient) => {
      if(doctor != null && patient != null){
        const newUser = new Prescription({
          date: req.body.Date,
          patient: req.body.Patient,
          patientname: patient.name,
          doctor: req.body.Doctor,
          doctorname: doctor.name,
          history: req.body.History,
          note: req.body.Note,
          medicine: medicine_array
          // dosage: req.body.Dosage,
          // frequency: req.body.Frequency,
          // days: req.body.Days,
          // instruction: req.body.Instruction
      });
      newUser.save()
        .then(user => {
          req.flash('success_msg', 'Prescription has been added successfully');
          res.redirect('/users/doctor_add_prescription');  
        })
        .catch(err => {
          console.log(err);
          return;
        });

      }
    })
  })

    
});

router.delete('/doctor_delete_prescription/:id', (req, res) => {
  Prescription.deleteOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Prescription has been deleted successfully');
    res.redirect('/users/doctor_view_prescription');
  });
});












router.get('/doctor_add_report', (req, res) => {
  if(doctor_data != null){
    Patient.find({},function(err, patients) {
      if (!patients || patients.length === 0) {
      res.render('users/doctor_add_report', {doctors:doctor_data, patients:false});
    } else {
        res.render('users/doctor_add_report', {doctors:doctor_data, patients:patients});
      }
    })
  }else{
    res.render('users/doctor_add_report', {doctors:false, patients:false});
  }
});

router.post('/submit_doctor_add_report', (req, res) => {
  Doctor.findOne({ _id: req.body.Doctor }, (err, doctor) => {
    Patient.findOne({ _id: req.body.Patient }, (err, patient) => {
      if(doctor != null && patient != null){
        const newUser = new Report({
          date: req.body.Date,
          patient: req.body.Patient,
          patientname: patient.name,
          doctor: req.body.Doctor,
          doctorname: doctor.name,
          description: req.body.Description,
          type: req.body.Type
      });
      newUser.save()
        .then(user => {
          req.flash('success_msg', 'Report has been added successfully');
          res.redirect('/users/doctor_add_report');  
        })
        .catch(err => {
          console.log(err);
          return;
        });

      }
    })
  })
})
router.get('/doctor_view_birth_report', function(req, res) {
  if(doctor_data != null){
    birth_report=[]
    Report.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/doctor_view_birth_report', { reports: false });
      } else {
        for(var i=0; i<files.length; i++){
          if(files[i].type == "birth" && doctor_data._id == files[i].doctor){
            birth_report.push(files[i]);
          }
        }
        res.render('users/doctor_view_birth_report', { reports: birth_report });
      }
    })
    }else{
      res.render('users/doctor_view_birth_report', { reports: false });
    }
});

router.get('/doctor_view_operation_report', function(req, res) {
  if(doctor_data != null){
    operation_report=[]
    Report.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/doctor_view_operation_report', { reports: false });
      } else {
        for(var i=0; i<files.length; i++){
          if(files[i].type == "operation" && doctor_data._id == files[i].doctor){
            operation_report.push(files[i]);
          }
        }
        res.render('users/doctor_view_operation_report', { reports: operation_report });
      }
    })
  }else{
    res.render('users/doctor_view_operation_report', { reports: false });
  }
});

router.get('/doctor_view_expire_report', function(req, res) {
  if(doctor_data != null){
    expire_report=[]
    Report.find({},function(err, files) {
      if (!files || files.length === 0) {
        res.render('users/doctor_view_expire_report', { reports: false });
      } else {
        for(var i=0; i<files.length; i++){
          if(files[i].type == "expire" && doctor_data._id == files[i].doctor){
            expire_report.push(files[i]);
          }
        }
        res.render('users/doctor_view_expire_report', { reports: expire_report });
      }
    })
  }else{
    res.render('users/doctor_view_expire_report', { reports: false });
  }
});

router.delete('/doctor_delete_birth_report/:id', (req, res) => {
  Report.deleteOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Report has been deleted successfully');
    res.redirect('/users/doctor_view_birth_report');
  });
});  

router.delete('/doctor_delete_operation_report/:id', (req, res) => {
  Report.deleteOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Report has been deleted successfully');
    res.redirect('/users/doctor_view_operation_report');
  });
});  
router.delete('/doctor_delete_expire_report/:id', (req, res) => {
  Report.deleteOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    req.flash('success_msg', 'Report has been deleted successfully');
    res.redirect('/users/doctor_view_expire_report');
  });
});  

router.get('/doctor_edit_birth_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/doctor_edit_birth_report', {report: user});
  });
});

router.post('/submit_doctor_edit_birth_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.date = req.body.Date;
    user.description = req.body.Description;
    user.type = req.body.Type
    user.save()
      .then(user => {
          req.flash('success_msg', 'Report has been edited successfully');
          res.redirect('/users/doctor_view_birth_report');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});

router.get('/doctor_edit_operation_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/admin_edit_operation_report', {report: user});
  });
});

router.post('/submit_doctor_edit_operation_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.date = req.body.Date;
    user.description = req.body.Description;
    user.type = req.body.Type
    user.save()
      .then(user => {
          req.flash('success_msg', 'Report has been edited successfully');
          res.redirect('/users/doctor_view_operation_report');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});

router.get('/doctor_edit_expire_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.render('users/doctor_edit_expire_report', {report: user});
  });
});

router.post('/submit_doctor_edit_expire_report/:id', (req, res) => {
  Report.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    user.date = req.body.Date;
    user.description = req.body.Description;
    user.type = req.body.Type
    user.save()
      .then(user => {
          req.flash('success_msg', 'Report has been edited successfully');
          res.redirect('/users/doctor_view_expire_report');
        })
        .catch(err => {
          console.log(err)
            // return;
        });
    
  });
});







// Logout User
router.get('/doctor_logout', (req, res) => {
  patient_data = null;
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect("/");
});





module.exports = router;