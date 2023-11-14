import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const options = path.join(__dirname, "../views/pages");

router.post("/login", (req, res) => {


  console.log("Log in route accessed succefully")

  //Storing username and password send by POST in the body
  let username = req.body["username"];
  let password = req.body["password"];
  //console.log("U: " + username + ", P: " + password);

  const checkCredentialQuery =
    "SELECT * FROM users WHERE username = '" +
    username +
    "'" +
    "AND password = '" +
    password +
    "'";

  pool.query(checkCredentialQuery, (err,result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error logging in - Go back" });
    } else if(result.rows.length === 0) {
      return res.status(400).json({ message: "Wrong username or password" });
    } else if (result.rows.length > 0) {
      //Setting logged in cookie and session to true
      res.cookie("isLoggedIn", "true", { httpOnly: false });
      //Setting current user cookie to username
      res.cookie("currentUser", username, { httpOnly: false });
      //res.status(200).render(options + "/index.ejs");
      res.status(200).json({ status: 'success' });

    }
  })

});

router.post("/logout", (req, res) => {
  console.log("Log out route accessed succefully")

  req.session.isLoggedIn = false;
  res.cookie("isLoggedIn", "false", { httpOnly: false });
  res.cookie("currentUser", false, { httpOnly: false });

  res.status(200).json({ status: 'success - you are logged out' });
});

export default router;
