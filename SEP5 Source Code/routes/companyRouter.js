import express from "express";
import pool from "../config/db.js";


const router = express.Router();


router.get('/', (req,res) => {
  var companyCVR = req.query.CVR
  pool.query("SELECT * FROM companies WHERE cvr = " + companyCVR , (error, results) => {
      if (error) {
        throw error;
      }
    res.render( 'pages/company', {details: results.rows, title: 'EcoEval - ' + results.rows[0].name});
  });
});


export default router;
