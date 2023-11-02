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
  //handle loggin in - auth thorugh DB
  /*
    psuedo:
    username and password: req.body.username, req.body.password
    test through DB in external file

    IF authenticated in DB the run
    req.session.isLoggedIn = true;

    In other parts of code req.session.isLoggedIn can now be used in -
      IF statements to see if user is logged in
    */

  //Storing username and password send by POST in the body
  let userName = req.body["username"];
  let password = req.body["password"];

  console.log("U: " + userName + ", P: " + password);

  //Setting logged in cookie and session to true
  req.session.isLoggedIn = true;
  res.cookie("isLoggedIn", "true", { httpOnly: false });
  //Setting current user cookie to username
  res.cookie("currentUser", userName, { httpOnly: false });
  res.render(options + "/index.ejs");
});

router.post("/logout", (req, res) => {


  req.session.isLoggedIn = false;
  res.cookie("isLoggedIn", "false", { httpOnly: false });
  res.cookie("currentUser", false, { httpOnly: false });

  res.render(options + "/index.ejs");
});

export default router;
