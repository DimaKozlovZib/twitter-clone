const Router = require("express");
const router = new Router()
const messageRouter = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.delete("/:id", authMiddleware, messageRouter.deleteMessage)
router.get("/", messageRouter.getMessages)
router.post("/", authMiddleware, messageRouter.addMessage)

module.exports = router