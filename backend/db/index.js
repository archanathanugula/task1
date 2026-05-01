const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost") ? { rejectUnauthorized: false } : false
});

const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB
};
