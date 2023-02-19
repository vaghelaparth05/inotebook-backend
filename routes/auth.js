const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Creating post request to save a user locally into the db
router.post('/', [
    body('firstName','Firstname should be atleast 3 characters, please enter again.').isLength({min: 3}),
    body('lastName','Lastname should be atleast 3 characters, please enter again.').isLength({min: 3}),
    body('email','Please enter a vailid email id.').isEmail(),
    body('password','Password must be atleast 5 characters long. Please re-enter.').isLength({min: 5}),
    // add another validation for phone number
] , (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
      }).then(user => res.json(user))
      .catch(err => {
        console.log(err);
        res.json({error: 'Please enter a unique value for email and mobile number.'});
      });
});

module.exports = router;