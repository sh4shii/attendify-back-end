const express = require('express');
const router  = express.Router();
const Attends = require('../models/Attends'); // Mongoose model for attendance
const { validationResult, body } = require('express-validator'); // Form validation of names and email etc.
const fetchUser = require('../middlewares/fetchuser')// Middleware to fetch user data from authToken

// ROUTE:1 - Fetch all data. method GET. Login required. endpoint: api/attendance/fetchalldata
router.get('/fetchalldata', fetchUser, async (req,res)=>{
    try {
        // Fetching all the attendance data of the user
        const attends = await Attends.find({user: req.user.id});
        res.json(attends)
    } catch (error) {
        console.error(error);
        res.status(400).send("Internal Server Error");
    }
})

// ROUTE:2 - Adding data. method POST. Login required. endpoint: api/attendance/adddata

// Validation format while adding data
const attendsValidation = [
    body('subject', 'Enter a valid subject').isLength({min: 2}),
];

router.post('/adddata', fetchUser, attendsValidation, async (req,res)=>{
    try {
        // Prevent empty values
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()}); 
        }
        // Adding a new data and saving to db
        const {subject} = req.body;
        const attend = new Attends({
            subject, user: req.user.id
        })
        const saveAttend = await attend.save();
        res.json(saveAttend);
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE:3 - Update existing data. method PUT. Login required. endpoint: api/attendance/updatedata/:id
router.put('/updatedata/:id', fetchUser, async (req,res)=>{
    try {
        // Data written in the new attendance
        const {subject,classes,present,percent} = req.body;
        const updatedData = {};
        if(subject){updatedData.subject = subject};
        if(classes){updatedData.classes = classes};
        if(present){updatedData.present = present};
        if(percent){updatedData.percent = percent};

        // Search the subject to be updated and update it
        // Checking valid id and user
        let sub_for_update = await Attends.findById(req.params.id);
        if(!sub_for_update){
            return res.status(404).send("Not Found");
        }
        if(sub_for_update.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Updating the previous note with the updatedNote
        sub_for_update = await Attends.findByIdAndUpdate(req.params.id, {$set: updatedData}, {new: true});
        res.json({sub_for_update});

    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE:4 - Delete subject. method DELETE. Login required. endpoint: api/attendance/deletedata/:id
router.delete('/deletedata/:id', fetchUser, async (req,res)=>{
    try {
        // Search the subject to be deleted and delete it
        // Checking valid id and user
        let sub_for_delete = await Attends.findById(req.params.id);
        if(!sub_for_delete){
            return res.status(404).send("Not Found");
        }
        if(sub_for_delete.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Deleting the subject with respect to the given id
        sub_for_delete = await Attends.findByIdAndDelete(req.params.id);
        res.json({"Success": "Successfully deleted the note", "Note": sub_for_delete});

    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;