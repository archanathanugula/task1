const express = require("express");
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  addMember,
  removeMember 
} = require("../controllers/projectController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/", auth, role("Admin"), createProject);
router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, role("Admin"), deleteProject);
router.put("/:id/add-member", auth, role("Admin"), addMember);
router.put("/:id/remove-member", auth, role("Admin"), removeMember);

module.exports = router;