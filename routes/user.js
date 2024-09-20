const express = require('express');
const wrapAsync = require('../Utils/wrapAsync');
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');


router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new User({ username, email });
        console.log(password)
        let registredUser = await User.register(newUser, password)
        console.log(registredUser)

        // Automatically Login after the Signup!
        req.login(registredUser, (err)=>{
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb")
            res.redirect("/lists")
        })
        
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup")
    }
}));

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})

router.post("/login", saveRedirectUrl,  passport.authenticate("local",
    { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        let {username} = req.body;
        req.flash("success", `Welcome Back : ${username.toUpperCase()}!`);

        let redirectUrl = res.locals.redirectUrl || "/lists";
        
        res.redirect(redirectUrl);
    }
)

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
       if(err){
        next(err);
       }
       req.flash("success", "You Logout Successfully!");
       res.redirect("/login")
    })
})

module.exports = router;