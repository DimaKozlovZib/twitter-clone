const Router = require("express");
const router = new Router()
const messageRouter = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");
const interactionMessage = require("../analytics/interactionMessage");

router.delete("/:id", authMiddleware, messageRouter.deleteMessage)
router.get("/", authOrNotMiddleware, messageRouter.getMessages)
router.post("/", authMiddleware, messageRouter.addMessage)
router.post("/searchMessages", messageRouter.searchMessages)
router.post("/like", authMiddleware, messageRouter.likeMessage)
router.post("/getMessageInfo", authOrNotMiddleware, messageRouter.getMessageInfo)
router.post("/addCommentToMessage", authMiddleware, messageRouter.addComment)
router.post("/getMessageContent", authOrNotMiddleware, messageRouter.getMessageContent)

router.post("/setCommentMood", authMiddleware, interactionMessage.determiningMood)

router.post("/messageShown", authMiddleware, interactionMessage.setMessageShown)

module.exports = router