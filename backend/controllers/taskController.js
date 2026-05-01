const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filters = {};
    if (req.user.role !== "Admin") filters.assigned_to = req.user.id;
    if (req.query.projectId) filters.project_id = req.query.projectId;

    const tasks = await Task.find(filters);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const db = require("../db");
    const result = await db.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const db = require("../db");
    await db.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.json({ msg: "Task removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
