const express = require('express');
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js")
const multer = require("multer");
const path = require("path")
const { isLoggedIn, validateListings, isOwner } = require("../middleware.js");
const listController = require('../controllers/listing.js');

const {storage} = require("../cloudConfig.js");
// router.use(express.static(path.join(__dirname, "/uploads")))

const upload = multer({storage});

//index route
router.route("/")
.get( wrapAsync(listController.index))
.post(
    isLoggedIn,
    upload.single('list[image]'),
    validateListings,
    wrapAsync(listController.createListWithImg)
);


// router.get("/", wrapAsync(listController.index));

//New Route
router.get("/new", isLoggedIn, wrapAsync(listController.newList));

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listController.editRoute)
);

router.route("/:id")
.get(wrapAsync(listController.showRoute)
)
.put(isLoggedIn,
    isOwner,
    upload.single('list[image]'),
    validateListings,
    wrapAsync(listController.updateRoute)
).delete(    isLoggedIn,
    isOwner,
    wrapAsync(listController.destroyRoute)
);

module.exports = router;