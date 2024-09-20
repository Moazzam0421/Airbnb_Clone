const List = require("../models/listing")

module.exports.index = async (req, res) => {
    // Update all documents with the same image URL
    // await List.updateMany({}, { img: defaultLink });
    let allList = await List.find({});
    // console.log(allList);
    res.render("./lists/index.ejs", { allList });
}

module.exports.newList = async (req, res, next) => {
    res.render("./lists/new.ejs");
}

module.exports.createRouteWithImg = async (req, res, next) => {
    const newList = new List(req.body.list);

    // Check if an image was uploaded and set the image path
    if (req.file) {
        newList.img = `/uploads/${req.file.filename}`;
    } else {
        newList.img = defaultLink; // Set default image if no image is uploaded
    }
    newList.owner = req.user._id;
    await newList.save();
    req.flash("success", "New Post Added Successfully!");
    res.redirect("/lists");
}

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
        req.flash("error", "Post you searched for does not exist!");
        res.redirect("/lists");
    }
    res.render("./lists/edit.ejs", { list });
}

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.list;

    // Check if a new image is uploaded
    if (req.file) {
        updatedData.img = `/uploads/${req.file.filename}`;
    }

    await List.findByIdAndUpdate(id, updatedData);

    req.flash("success", "Post is Updated Successfully!");
    res.redirect(`./${id}`);
}

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    let list = await List.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if (!list) {
        req.flash("error", "Post you searched for does not exist!");
        res.redirect("/lists");
    }
    res.render("./lists/show.ejs", { list });
}

module.exports.destroyRoute = async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    req.flash("error", "Post was Deleted Successfully!");
    res.redirect("/lists");
}