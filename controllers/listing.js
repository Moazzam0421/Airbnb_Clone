const List = require("../models/listing");

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

module.exports.createListWithImg = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;  // Corrected this too; use `req.file.filename` for Cloudinary's filename
    console.log(url, "  ", filename);  // Remove `path`, log only `url` and `filename`

    const newList = new List(req.body.list);
    newList.image = { url, filename };
    console.log(newList.image);

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

    let orignalImgUrl = list.image.url;
    orignalImgUrl = orignalImgUrl.replace("/upload", "/upload/w_200");
    res.render("./lists/edit.ejs", { list, orignalImgUrl });
}

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.list;
    let updatedList = await List.findByIdAndUpdate(id, updatedData);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        updatedList.image = { url, filename };
        await updatedList.save();
    }

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