const Project = require("../models/projectModel");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create(name, description, req.user.id);
    await Project.addMember(req.user.id, project.id);
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findByUser(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    project.members = await Project.getMembers(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const db = require("../db");
    const result = await db.query(
      "UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const db = require("../db");
    await db.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    res.json({ msg: "Project removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    await Project.addMember(userId, req.params.id);
    res.json({ msg: "Member added" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const db = require("../db");
    await db.query("DELETE FROM project_members WHERE user_id = $1 AND project_id = $2", [userId, req.params.id]);
    res.json({ msg: "Member removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
