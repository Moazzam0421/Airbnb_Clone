const mongoose = require("mongoose")
const initData = require("./data.js");
const List = require("../models/listing.js");

main()
.then(()=>console.log("Connection Successful"))
.catch((err)=> console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

const initDB = async () =>{
    await List.deleteMany({});
    await List.insertMany(initData.data);
    console.log("Data was Initialized")
}

initDB();