const Router = require("express");
const router = new Router()
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");

router.post("/registration", userController.registration)
router.post("/autoLogin", authMiddleware, userController.autoLogin)
router.post("/login", userController.login)
router.get("/auth", userController.auth)
router.get("/friends", authOrNotMiddleware, userController.getFriends)
router.get("/getFirstConnectionUsers", authMiddleware, userController.getFirstConnectionUsers)
router.get("/:id", authOrNotMiddleware, userController.getUser)
router.post("/setCover", authMiddleware, userController.setCover)
router.post("/setAvatar", authMiddleware, userController.setAvatar)
router.post("/edit", authMiddleware, userController.changeInfo)
router.get("/:id/friends", userController.getFriends)
router.post("/subscribe", authMiddleware, userController.subscribe)
router.post("/unsubscribe", authMiddleware, userController.unsubscribe)
router.post("/logout", authMiddleware, userController.logout)
router.post("/content/:id", userController.getUserMessages)

module.exports = router