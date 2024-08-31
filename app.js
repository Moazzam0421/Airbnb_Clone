const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require("./Utils/ExpressError.js");
const listings = require("./routes/listing.js");
const review = require("./routes/review.js")

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

app.listen(8080, ()=>{
    console.log("Listning port on 8080");
})