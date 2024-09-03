const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require("./Utils/ExpressError.js");
const listings = require("./routes/listing.js");
const review = require("./routes/review.js")
const session = require('express-session');
const flash = require('connect-flash');


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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



app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(()=>console.log("Connection Successful"))
.catch((err)=> console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

app.get('/', (req, res)=>{
    res.send("Working");
});

// Access Express Session
app.use(session(sesOptions));
// Access Flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // Store success flash message
    res.locals.error = req.flash("error"); // Store error flash message
    next();
});

app.use("/lists", listings);

app.use("/lists/:id/reviews", review)

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Some thing went WRong"} = err;
    res.status(statusCode).render("./lists/error.ejs", {statusCode, message});
    console.log(statusCode)

    // res.status(statusCode).send(message); 
})

const PORT = 8080; // or any port you are using
const HOST = '0.0.0.0'; // Listen on all network interfaces
app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});