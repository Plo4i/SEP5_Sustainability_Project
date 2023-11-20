import express from "express";
import pool from "../config/db.js";
import upload from "../public/scripts/mutlerComponent.js";
import currentDate from '../public/scripts/getTimeStamp.js';

const router = express.Router();

router.get('/', (req,res) => {
    res.render('pages/register')
});


router.post("/", upload.single('picture'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = '/images/' + file.filename;

  // Storing user details send by POST in the body
  const { username, password, email, subscription } = req.body;

  // Preparing user information
  const userInfo = [filePath, username, password, email, subscription, currentDate];

  // Setting queries
  const checkUsernameQuery = "SELECT * FROM users WHERE username = $1";
  const insertUserQuery =
    "INSERT INTO users (image_url, username, password, email, subscription_status, registration_date) VALUES ($1,$2,$3,$4,$5,$6)";

  console.log(
    "U: " +
      username +
      ", P: " +
      password +
      ", E: " +
      email +
      ", S: " +
      subscription +
      ", R: " +
      currentDate
  );

  pool.query(checkUsernameQuery, [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error");
    } else if (result.rows.length > 0) {
      // If the user already exists, send a response to the frontend
      return res.status(400).send("User already exists");
    } else {
      pool.query(insertUserQuery, userInfo, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Server error");
        } else {
          // Setting logged in cookie and session to true
          res.cookie("isLoggedIn", "true", { httpOnly: false });
          // Setting current user cookie to username
          res.cookie("currentUser", username, { httpOnly: false });
          res.status(200).redirect("/");
        }
      });
    }
  });
});

export default router;
