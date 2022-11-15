const Router = require("express");
const router = new Router()
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware')

router.post("/registration", userController.registration)
router.post("/login", authMiddleware, userController.login)
router.get("/auth", userController.auth)
router.get("/:id", userController.getUser)
router.get("/:id/friends", userController.getFriends)

module.exports = router