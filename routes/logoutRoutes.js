const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Adjust the path to your controller

router.post('/',loginController.logout);

module.exports = router;
