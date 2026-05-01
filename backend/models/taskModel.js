const db = require("../db");

const Task = {
  create: async (data) => {
    const { title, description, project_id, assigned_to, due_date } = data;
    const finalDueDate = due_date === "" ? null : due_date;
    const result = await db.query(
      "INSERT INTO tasks (title, description, project_id, assigned_to, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, project_id, assigned_to, finalDueDate]
    );
    return result.rows[0];
  },
  find: async (filters = {}) => {
    let query = `
      SELECT t.*, p.name as project_name, u.name as assigned_to_name 
      FROM tasks t 
      LEFT JOIN projects p ON t.project_id = p.id 
      LEFT JOIN users u ON t.assigned_to = u.id
    `;
    let params = [];
    let where = [];

    if (filters.assigned_to) {
      params.push(filters.assigned_to);
      where.push(`t.assigned_to = $${params.length}`);
    }
    if (filters.project_id) {
      params.push(filters.project_id);
      where.push(`t.project_id = $${params.length}`);
    }

    if (where.length > 0) {
      query += " WHERE " + where.join(" AND ");
    }

    const result = await db.query(query, params);
    return result.rows;
  }
};

module.exports = Task;
