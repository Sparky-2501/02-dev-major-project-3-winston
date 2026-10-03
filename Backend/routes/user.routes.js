const express = require('express');
const router = express.Router();
const {body } = require("express-validator");
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage("First name must be with atleast 3 character"),
    body('password').isLength({min:6}).withMessage("password must be with atleast 6 characters")
], UserController.registerUser);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Invalid Password')
], UserController.loginUser);

router.get('/profile', authMiddleware.authUser, UserController.getUserProfile);

router.get('/logout', authMiddleware.authUser, UserController.logoutUser);

module.exports = router;
