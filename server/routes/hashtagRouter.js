const Router = require("express");
const router = new Router()
const hashtagRouter = require("../controllers/hashtagController");
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");

router.get('/getSome', hashtagRouter.getHashtagsForInput)
router.get("/:name/getMessages", authOrNotMiddleware, hashtagRouter.getMessages)
router.get("/:name", hashtagRouter.getHashtag)
router.post("/", hashtagRouter.addHashtag)

module.exports = router