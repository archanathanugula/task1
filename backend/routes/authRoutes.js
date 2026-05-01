const express = require("express");
const { signup, login, getUser, getAllUsers, changePassword } = require("../controllers/authController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", auth, getUser);
router.get("/all-users", auth, role("Admin"), getAllUsers);
router.put("/change-password", auth, changePassword);

module.exports = router;