const express = require("express");
const Users = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Create a User using : POST "/api/auth/". Doesn't require auth

router.post(
  "/",
  body("email", "Enter valid email-id").isEmail(),
  body("name", "Enter valid name").isLength({ min: 3 }),
	body('password', "Password must be 8 characters long").isLength({min: 8}),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Users.create({
			name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }).then(user => res.json(user))
		.catch(err => {console.log(err)
		res.json({"error": "Please enter unique value for email",
			"message": err.message})});
  }
);

module.exports = router;
