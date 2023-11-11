import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const options = path.join(__dirname, "../views/pages");

router.get("/company", (req, res) => {
  let company = {
    name: "Phind",
    location: "San Francisco",
    industry: "Technology",
    employees: 100,
  };

  console.log("Sending company data:", company); // log the data before sending it
  res.status(200).json(company);
});

export default router;
