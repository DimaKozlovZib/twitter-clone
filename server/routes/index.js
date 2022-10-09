const Router = require("express");
const router = new Router()
const hashtagRouter = require("./hashtagRouter");
const userRouter = require("./userRouter");

router.use("/user", userRouter)
router.use("/hashtag", hashtagRouter)

module.exports = router