import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const options = path.join(__dirname, "../views/pages");


router.get("/company", (req, res) => {// Replace this with your actual data fetching logic
  res.render(options + '/company.ejs');


// Use company name to access the corresponding page to be rendered! 
// We could make it so that the index page MAIN section is hidden and then
// just send "INCLUDE" a generic company component with an object created from the DV
//That way when creating companies we will always just send the data along
//


});

export default router;
