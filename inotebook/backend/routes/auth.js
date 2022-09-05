const express = require("express");
const Users = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const JWT_SIGN = 'Masterkey#1';
const jwt = require('jsonwebtoken');
// Create a User using : POST "/api/auth/createuser". Doesn't require auth

router.post(
  "/createuser",
  body("email", "Enter valid email-id").isEmail(),
  body("name", "Enter valid name").isLength({ min: 3 }),
	body('password', "Password must be 8 characters long").isLength({min: 8}),
  async (req, res) => {
    // If there are errors return bad request and errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with same email exist already.

    let user = await Users.findOne({email: req.body.email});

    if(user){
      res.status(400).json({error: "Sorry a user with this email already exist"});
    }
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(req.body.password,salt);
    //Create a new User
    user = await Users.create({
			name: req.body.name,
      email: req.body.email,
      password: securedPassword,
    });

    const data = {
      user:{
        id: user.id
      }
    };

    const authToken = jwt.sign(data,JWT_SIGN);
    //console.log(jwtData);
    res.json({authToken});
    //res.json(user);
  }
);

module.exports = router;
