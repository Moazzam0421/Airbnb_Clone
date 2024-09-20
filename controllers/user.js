const User = require("../models/user")

module.exports.signUpForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup =  async (req, res) => {
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
}

module.exports.logInForm = (req, res) => {
    res.render("user/login.ejs")
}

module.exports.login = async (req, res) => {
    let {username} = req.body;
    req.flash("success", `Welcome Back : ${username.toUpperCase()}!`);

    let redirectUrl = res.locals.redirectUrl || "/lists";
    
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You Logout Successfully!");
        res.redirect("/login")
    })
}