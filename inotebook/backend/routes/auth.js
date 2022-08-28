const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
// Create a User using : POST "/api/auth/". Doesn't require auth

router.post('/', (req, res) => {
    const user = Users(req.body);
    console.log(user);
    user.save();
    res.json(user);
});

module.exports = router;