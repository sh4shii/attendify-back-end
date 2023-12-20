const express = require('express');
const router  = express.Router();
const Review = require('../models/Review'); // Mongoose model for reviews
const { validationResult, body } = require('express-validator'); // Form validation of names and reviews

// ROUTE:1 - Fetch all reviews. method GET. endpoint: api/reviews/fetchreviews
router.get('/fetchreviews', async (req,res) => {
    try {
        const reviews = await Review.find({});
        res.json(reviews)
    } catch (error) {
        console.error(error);
        res.status(400).send("Internal Server Error");
    }
});

// ROUTE:2 - Post a review. method POST. endpoint: api/reviews/addreview
const reviewValidation = [
    body('name', 'Enter a valid name').isLength({min: 2}),
    body('review', 'Enter a valid review').isLength({min: 2})
]

router.post('/addreview', reviewValidation, async (req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()}); 
        }

        const {name, review} = req.body;
        const reviewPosted = new Review({
            name, review
        });
        const saveReview = await reviewPosted.save();
        res.json(saveReview);
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;