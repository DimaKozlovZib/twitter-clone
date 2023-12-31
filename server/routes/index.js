const Router = require("express");
const router = new Router()
const hashtagRouter = require("./hashtagRouter");
const userRouter = require("./userRouter");
const messageRouter = require("./messageRouter");
const generalСontrollers = require("../controllers/generalСontrollers");
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");

router.use("/message", messageRouter)
router.use("/user", userRouter)
router.use("/hashtag", hashtagRouter)

router.get('/search', authOrNotMiddleware, generalСontrollers.search)

module.exports = router