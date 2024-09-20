const express = require('express');
const wrapAsync = require('../Utils/wrapAsync');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user')

//Signup GET and POST routes
router.route("/signup")
.get(userController.signUpForm)
.post(wrapAsync(userController.signup)
);

//Login GET and POST routes
router.route("/login")
.get(userController.logInForm)
.post(saveRedirectUrl,
    passport.authenticate("local",
    { failureRedirect: "/login", failureFlash: true }),
    userController.login
);

router.get("/logout", userController.logout)

module.exports = router;