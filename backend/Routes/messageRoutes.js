const express = require("express");
const {
  allMessages,
  sendMessage,
  sendFileMessage,
  sendImageMessage,
  deleteMessage,
  sendVideoMessage,
  sendAudioMessage,
  forwardMessage
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/sendfile").post(sendFileMessage)
router.route("/sendImage").post(sendImageMessage)
router.route("/sendVideo").post(sendVideoMessage)
router.route("/sendAudio").post(sendAudioMessage)
router.route("/forward").post(forwardMessage)
router.route("/:chatId").get(protect, allMessages);
router.route("/deletemessage").post(protect, deleteMessage)

module.exports = router;