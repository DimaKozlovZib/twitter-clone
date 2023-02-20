const Router = require("express");
const router = new Router()
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");

router.post("/registration", userController.registration)
router.post("/autoLogin", authMiddleware, userController.autoLogin)
router.post("/login", userController.login)
router.get("/auth", userController.auth)
router.get("/:id", authOrNotMiddleware, userController.getUser)
router.post("/setCover", authMiddleware, userController.setCover)
router.get("/:id/friends", userController.getFriends)

module.exports = router