const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, updategrouppic, addToAdmin, removeFromAdmin, deleteGroup} = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/").post(protect, accessChat)
router.route("/").get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)
router.route("/grouppicupdate").post(protect, updategrouppic)
router.route("/rename").put(protect, renameGroup)
router.route("/groupadd").put(protect, addToGroup)
router.route("/groupremove").put(protect, removeFromGroup)
router.route("/adminadd").put(protect, addToAdmin)
router.route("/adminremove").put(protect, removeFromAdmin)
router.route("/deletechat").put(protect, deleteGroup)

module.exports = router;
