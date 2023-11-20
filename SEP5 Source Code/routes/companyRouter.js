import express from "express";
import fs from 'fs';
import pool from "../config/db.js";


const router = express.Router();

// Renders the company.ejs
router.get('/', async (req,res) => {
    res.render('pages/company');
});

// Gets the data about the selected company through http query
router.get('/data', async (req,res) => {
    try {
        const companyCVR = req.query.CVR;
        const results = await pool.query("SELECT * FROM companies WHERE cvr = $1", [companyCVR]);

    if (results.rows.length === 0) {
        // If no company is found, return a 404 status
        res.status(404).json({ error: 'Company not found' });
    } else {
        // If company is found
        console.log(results.rows[0]);
        res.status(200).json(
            {details: results.rows[0],
            title: 'EcoEval - ' + results.rows[0].name}
        );
        
    }
} catch (error) {
    // Handle errors more gracefully
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});


export default router;
