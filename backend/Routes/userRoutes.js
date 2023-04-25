const express = require('express');
const { registerUser, authUser, allUsers, renameUser, picUpdate, resetpassword} = require("../controllers/userControllers");
const { protect } = require('../middleware/authmiddleware');


const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser)
router.post("/rename", renameUser)
router.post("/editprofilepic", picUpdate)
router.post("/resetpassword", resetpassword)

module.exports = router;
