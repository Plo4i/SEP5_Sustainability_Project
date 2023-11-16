import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render('pages/login', {title: 'Login'});
});

router.post("/", async (req, res) => {
  const {username, password} = req.body;

   try {
    // Query the database for user credentials
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {

      // Set user information in the session
      req.session.user = result.rows[0];

      //Setting logged in cookie and session to true
      res.cookie("isLoggedIn", "true", { httpOnly: false });
      //Setting current user cookie to username
      res.cookie("currentUser", username, { httpOnly: false });

      res.status(200).redirect("/");
    } else {
      return res.status(400).send("Wrong username or password");
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
