import express from "express";
import pool from "../config/db.js";
import upload from '../public/scripts/mutlerComponent.js';


const router = express.Router();

// Renders the company.ejs
router.get('/', async (req, res) => {
    if (req.session.user !== undefined) {
        res.render('pages/companyInsert');
    } else {
        res.status(401).json({ error: 'User not logged in!' });
    }
});

router.post('/', upload.single('logo'), (req, res) => {
    if(req.session.user != undefined) {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const filePath = '/images/' + file.filename;
        console.log(req.body);
        const { name, cvr, email, website, industry, description } = req.body;
        const companyInfo = [name, filePath, cvr, email, website, industry, description];

        const checkCVRQuery = "SELECT * FROM companies WHERE cvr = $1";
        const insertCompanyQuery = `INSERT INTO companies 
        (name, image_url, cvr, email, website, industry, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;

        pool.query(checkCVRQuery, [cvr], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
            } else if (result.rows.length > 0) {
                return res.status(400).json({ error: 'Company already exists' });
            } else {
                pool.query(insertCompanyQuery, companyInfo, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Server error' });
                    } else {
                        res.status(200).json({ success: true });
                        res.redirect('/user')
                    }
                });
            }
        });
    }
    else{
        res.status(401).json({ error: 'User not logged in!' });
    }
});

export default router;