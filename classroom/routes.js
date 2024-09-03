const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
app.use(flash());
const path = require('path');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sesOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
};

app.use(session(sesOptions));

// app.get('/login', (req, res) => {
//     req.flash('success', 'You have logged in successfully!');
//     res.redirect('/home');
// });


// app.get('/home', (req, res) => {
//     const message = req.flash('success');
//     res.render("home.ejs", {message});
// });

app.use((req, res, next)=>{
    res.locals.errMsg = req.flash("error")
    res.locals.succMsg = req.flash("success")
    next();
})

app.get("/register", (req, res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "You are not registred")
    }
    else{
        req.flash('success', "Your are Successfully Registred");
    }
    res.redirect(`/hello`);
});

app.get("/hello", (req, res) => {
    console.log(req.session.name)
    
    res.render(`home.ejs`, {name: req.session.name});
})

// app.get("/test", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`request session count value = ${req.session.count}`);
// })

app.listen(3000, () => {
    console.log("Listning On Port : 3000");
})