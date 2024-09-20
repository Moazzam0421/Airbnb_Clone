module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be login to access some Grants!");
        return res.redirect("/login")
    }
    next()
}