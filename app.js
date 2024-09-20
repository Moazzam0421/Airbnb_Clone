if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require("./Utils/ExpressError.js");

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Router paths access
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// Mongoose Connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}
main().then(() => console.log("Connection Successful")).catch((err) => console.log(err));

// Middleware
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session Configuration
const sesOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// Express Session and Flash Configuration
app.use(session(sesOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Middleware for All Views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // it is for Navbar login , signup, and logout
    next();
});

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/lists", listingRoute);
app.use("/lists/:id/reviews", reviewRoute);
app.use("/", userRoute);

// Home Route
app.get('/', (req, res) => {
    res.send("Working");
});

// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./lists/error.ejs", { statusCode, message });
    console.log(statusCode);
});

// Start Server
const PORT = 8080;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});
