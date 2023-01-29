const Router = require("express");
const router = new Router()
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const authOrNotMiddleware = require("../middleware/authOrNotMiddleware");

router.post("/registration", userController.registration)
router.post("/login", authMiddleware, userController.login)
router.get("/auth", userController.auth)
router.get("/:id", authOrNotMiddleware, userController.getUser)
router.get("/:id/friends", userController.getFriends)

module.exports = router