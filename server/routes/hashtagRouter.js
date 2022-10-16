const Router = require("express");
const router = new Router()
const hashtagRouter = require("../controllers/hashtagController");

router.get("/:id", hashtagRouter.getHashtag)
router.post("/", hashtagRouter.addHashtag)

module.exports = router