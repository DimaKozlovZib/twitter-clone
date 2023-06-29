const Router = require("express");
const router = new Router()
const messageRouter = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");

router.delete("/:id", authMiddleware, messageRouter.deleteMessage)
router.get("/", authOrNotMiddleware, messageRouter.getMessages)
router.post("/", authMiddleware, messageRouter.addMessage)
router.post("/searchMessages", messageRouter.searchMessages)
router.post("/like", authMiddleware, messageRouter.likeMessage)

module.exports = router