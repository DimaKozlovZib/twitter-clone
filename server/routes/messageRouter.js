const Router = require("express");
const router = new Router()
const messageRouter = require("../controllers/messageController");

router.delete("/:id", messageRouter.deleteMessage)
router.get("/", messageRouter.getMessages)
router.post("/", messageRouter.addMessage)

module.exports = router