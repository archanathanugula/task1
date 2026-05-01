const db = require("../db");

exports.getDashboardStats = async (req, res) => {
  try {
    let tasksQuery = "SELECT * FROM tasks";
    let tasksParams = [];
    let overdueQuery = "SELECT * FROM tasks WHERE due_date < CURRENT_DATE AND status != 'Completed'";
    let overdueParams = [];

    if (req.user.role !== "Admin") {
      tasksQuery += " WHERE assigned_to = $1";
      tasksParams.push(req.user.id);
      overdueQuery += " AND assigned_to = $1";
      overdueParams.push(req.user.id);
    }

    const tasksResult = await db.query(tasksQuery, tasksParams);
    const tasks = tasksResult.rows;

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;

    const overdueResult = await db.query(overdueQuery, overdueParams);

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdueCount: overdueResult.rows.length,
      overdueTasks: overdueResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
