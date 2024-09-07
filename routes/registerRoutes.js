const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Route to get the registration page
router.get('/', registerController.getRegisterPage);

// Route to handle form submission
router.post('/', registerController.postRegister);

module.exports = router;
