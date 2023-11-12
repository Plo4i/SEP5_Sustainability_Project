import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const options = path.join(__dirname, "../views/pages");

router.get("/", async (req, res) => {
  try {
    const companies = await pool.query('SELECT * FROM company');
    res.json(companies.rows);
  } catch (err) {
    console.error(err.message);
  }

  res.render(options + '/company.ejs')
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await pool.query('SELECT * FROM company WHERE name = \$1', [name]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
  }
 });

export default router;
