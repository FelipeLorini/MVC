const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validators');

router.get('/register', authController.showRegister);
router.post('/register', validateRegistration, authController.register);
router.get('/login', authController.showLogin);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
