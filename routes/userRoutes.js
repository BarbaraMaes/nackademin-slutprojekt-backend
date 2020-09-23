const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Login a user
router.post('/auth', userController.login);

//register a user
router.post('/register', userController.signup);

//get user information
// We probably won't need this endpoint
// On the README.md on "Auth End-Point Response"
// seems that all the user information is sended to
// the frontend whe he/she logs in. (Johan)
router.get('/me', userController.getInfo);

module.exports = router;
