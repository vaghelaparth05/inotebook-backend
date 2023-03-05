const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchuser");


// Json web secret key(Ideally this shouldn't be here, I guess)
const JSW_SECRET = "iamsherlockvaghela";

// Creating post request to save a user locally into the db
router.post(
  "/createUser",
  [
    body(
      "firstName",
      "Firstname should be atleast 3 characters, please enter again."
    ).isLength({ min: 3 }),
    body(
      "lastName",
      "Lastname should be atleast 3 characters, please enter again."
    ).isLength({ min: 3 }),
    body("email", "Please enter a vailid email id.").isEmail(),
    body(
      "password",
      "Password must be atleast 5 characters long. Please re-enter."
    ).isLength({ min: 5 }),
    // add another validation for phone number
  ],
  async (req, res) => {
    let success=false;
    // returning errors when found.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // check if user exists already
      let userEmail = await User.findOne({ email: req.body.email });
      let userPhoneNumber = await User.findOne({ email: req.body.phoneNumber });
      if (userEmail || userPhoneNumber) {
        return res
          .status(404)
          .json({
            error: "User with this email or phone number already exists!!!",
          });
      }
      // bcrypt for password protection
      const salt = await bcrypt.genSalt();
      const securePassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: securePassword,
        phoneNumber: req.body.phoneNumber,
      });
      // Instead of sending a ok message I will try and send a web token so that
      // when the user logs in for the next time he/she can be verified.
      const data = {
        user: {
          id: user.id,
        },
      };
      success=true;
      const authToken = jwt.sign(data, JSW_SECRET);
      res.send({success, authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong!!!");
    }
  }
);

// Creating post request to save a user locally into the db
router.post(
  "/login",
  [
    body("email", "Please enter a vailid email id.").isEmail(),
    body("password", "Password cannto be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    // returning errors when found.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    console.log(email, password);
    try {
      // check if user exists already
      let user = await User.findOne({ email: req.body.email });
      if(!user){
        return res
          .status(400)
          .json({
            error: "Please try to login with correct credentials!!!",
          });
      }
      
      const passwordCompare = await bcrypt.compare(password, user.password);

      if(!passwordCompare){
        return res
          .status(400)
          .json({
            error: "Please try to login with correct credentials!!!",
          });
      }

      // Instead of sending a ok message I will try and send a web token so that
      // when the user logs in for the next time he/she can be verified.
      const data = {
        user: {
          id: user.id,
        },
      };
      success=true;
      const authToken = jwt.sign(data, JSW_SECRET);
      res.send({success, authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong!!!");
    }
  }
);

// Sending User data by validating with JWT
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong!!!");
  }
})

module.exports = router;
