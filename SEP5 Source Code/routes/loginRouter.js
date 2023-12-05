import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render('pages/login', {title: 'Login'});
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database for user credentials
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Check if the password matches the username
      if (user.password !== password) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Set user information in the session
      req.session.user = user;
      //Setting logged in cookie and session to true
      res.cookie("isLoggedIn", "true", { httpOnly: false });
      //Setting current user cookie to username
      res.cookie("currentUser", username, { httpOnly: false });
      //Setting current user_id cookie
      res.cookie("currentUserId", user.username, { httpOnly: false });

      res.status(200).json({ 'success': true })
    } else {
      return res.status(400).json({ error: 'Invalid username' });
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
