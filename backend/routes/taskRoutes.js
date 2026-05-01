const express = require("express");
const { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} = require("../controllers/taskController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/", auth, role("Admin"), createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, role("Admin"), deleteTask);

module.exports = router;