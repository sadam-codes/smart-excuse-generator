import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

export const createUser = async (name, email, hashedPassword, role) => {
  const res = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, role]
  );
  return res.rows[0];
};
