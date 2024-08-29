const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require("./Utils/wrapAsync.js");

const ExpressError = require("./Utils/ExpressError.js");

const sampleListings = require("./schema.js");

app.engine('ejs', engine);

const List = require("./models/listing.js");

const defaultLink = '/images/defaultImage.jpg';


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

const validateListings = (req, res, next) => {
    const { error } = sampleListings.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

app.get("/lists", wrapAsync(async (req, res)=>{
    // Update all documents with the same image URL
    // await List.updateMany({}, {img: defaultLink});
    let allList = await List.find({});
    // console.log(allList);
    res.render("./lists/index.ejs", {allList});
}));


//New Route
app.get("/lists/new", wrapAsync(async (req, res)=>{
    res.render("./lists/new.ejs");
}));

//Create Route
app.post("/lists", validateListings, wrapAsync(async (req, res, next) => {
    let newList = new List(req.body.list);
    await newList.save();
    res.redirect("/lists");
}));


//Edit Route
app.get("/lists/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const list = await List.findById(id);
    res.render("./lists/edit.ejs", {list});
}));

//Update Route
app.put("/lists/:id", validateListings, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await List.findByIdAndUpdate(id, {...req.body.list});
    res.redirect(`./${id}`);
}));

//Show Route
app.get("/lists/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list = await List.findById(id);
    res.render("./lists/show.ejs", {list});
}));

//Delete Route
app.delete("/lists/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/lists");
}));

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