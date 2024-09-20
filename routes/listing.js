const express = require('express');
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js")
const multer = require("multer");
const path = require("path")
const { isLoggedIn, validateListings, isOwner } = require("../middleware.js");
const listController = require('../controllers/listing.js');

const {storage} = require("../cloudConfig.js");
// router.use(express.static(path.join(__dirname, "/uploads")))

// // Configure multer for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

const upload = multer({storage});

//index route
router.route("/")
.get( wrapAsync(listController.index))
.post(
    isLoggedIn,
    upload.single('image'),
    validateListings,
    wrapAsync(listController.createRouteWithImg)
);

// router.get("/", wrapAsync(listController.index));


//New Route
router.get("/new", isLoggedIn, wrapAsync(listController.newList));

// Create Route with Image Upload
// router.post("/",
//     isLoggedIn,
//     upload.single('image'),
//     validateListings,
//     wrapAsync(listController.createRouteWithImg));


//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listController.editRoute)
);


router.route("/:id")
.put(isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListings,
    wrapAsync(listController.updateRoute)
).get(wrapAsync(listController.showRoute)
).delete(    isLoggedIn,
    isOwner,
    wrapAsync(listController.destroyRoute)
);

// Update Route with Image Upload
// router.put("/:id", isLoggedIn,
//     isOwner,
//     upload.single('image'),
//     validateListings,
//     wrapAsync(listController.updateRoute));

//Show Route
// router.get("/:id", wrapAsync(listController.showRoute));

//Delete Route
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listController.destroyRoute));

module.exports = router;