const db = require("../db");

const Project = {
  create: async (name, description, created_by) => {
    const result = await db.query(
      "INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
      [name, description, created_by]
    );
    return result.rows[0];
  },
  addMember: async (userId, projectId) => {
    return db.query(
      "INSERT INTO project_members (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, projectId]
    );
  },
  findByUser: async (userId) => {
    const result = await db.query(
      `SELECT p.* FROM projects p 
       JOIN project_members pm ON p.id = pm.project_id 
       WHERE pm.user_id = $1`,
      [userId]
    );
    return result.rows;
  },
  findById: async (id) => {
    const result = await db.query("SELECT * FROM projects WHERE id = $1", [id]);
    return result.rows[0];
  },
  getMembers: async (projectId) => {
    const result = await db.query(
      "SELECT u.id, u.name, u.email, u.role FROM users u JOIN project_members pm ON u.id = pm.user_id WHERE pm.project_id = $1",
      [projectId]
    );
    return result.rows;
  }
};

module.exports = Project;
