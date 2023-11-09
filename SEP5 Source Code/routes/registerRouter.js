import express from "express";
import pool from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const options = path.join(__dirname, "../views/pages");

const router = express.Router();

router.post("/register", (req, res) => {
  var date = new Date();
  var today =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  //Storing username and password send by POST in the body
  let imgURL = "empty";
  let username = req.body["username"];
  let password = req.body["password"];
  let email = req.body["email"];
  let subscription_status = "paying";
  let registration_date = today;

  const checkUsernameQuery =
    "SELECT * FROM users WHERE username = '" + username + "'";
  const checkEmailQuery = "SELECT * FROM users WHERE email = '" + email + "'";
  const insertUserQuery =
    "INSERT INTO users (image_url, username, password, email, subscription_status, registration_date) VALUES ('" +
    imgURL +
    "', '" +
    username +
    "', '" +
    password +
    "', '" +
    email +
    "', '" +
    subscription_status +
    "', '" +
    registration_date +
    "')";

  console.log(
    "U: " +
      username +
      ", P: " +
      password +
      ", E: " +
      email +
      ", S: " +
      subscription_status +
      ", R: " +
      registration_date
  );

  pool.query(checkUsernameQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error");
    } else if (result.rows.length > 0) {
      // If the user already exists, send a response to the frontend
      return res.status(400).send("User already exists");
    } else {
      pool.query(insertUserQuery, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Server error");
        } else {
          //Setting logged in cookie and session to true
          res.cookie("isLoggedIn", "true", { httpOnly: false });
          //Setting current user cookie to username
          res.cookie("currentUser", username, { httpOnly: false });
          res.status(200).render(options + "/index.ejs");
        }
      });
    }
  });
});

export default router;
