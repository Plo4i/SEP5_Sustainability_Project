import express from "express";
import pool from "../config/db.js";
import upload from '../public/scripts/mutlerComponent.js';
import formatedData from '../public/scripts/getTimeStamp.js';


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

        // Getting the data
        const file = req.file;
        const { name, cvr, email, website, industry, description } = req.body;
        
        // Scripts for SQL Queries
        const companyExistsQuery = `SELECT * FROM companies WHERE cvr = $1;`;
        
        const companyUpdateQuery = 
        `UPDATE companies 
        SET name = $1, email = $3, website = $4, industry = $5, description = $6
        WHERE cvr = $2;`

        const checkCVRQuery = "SELECT * FROM companies WHERE cvr = $1";

        const insertCompanyQuery = 
        `INSERT INTO companies 
        (name, image_url, cvr, email, website, industry, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;

        const attachUserToCompany = 
        `INSERT INTO company_creation 
        (company_id, user_id, creationdate) 
        VALUES ($1, $2, $3)`;
  
        
        // Check if image is uploaded. Maybe the user want to update company.
        if (!file) {
            const companyInfoUpdate= [name, cvr, email, website, industry, description];

            // Check if the company exists
            pool.query(companyExistsQuery, [cvr], (err, result) => { 
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error' });
                }
                // We are sure the user wants to update
                else if (result.rows.length) { 
                    pool.query(companyUpdateQuery, companyInfoUpdate, (err) => { 
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Server error' });
                        } 
                        else {
                            res.status(200).json({success: true})
                        }
                    });
                };
            });
        }
        // We have a file so the user wants to create new company
        else {
            const filePath = '/images/' + file.filename;
            const companyInfoInsert = [name, filePath, cvr, email, website, industry, description];
            const userCompanyInfo = [cvr, req.session.user.id, formatedData];

            pool.query(checkCVRQuery, [cvr], (err, result) => { //Checking if there is already one
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error' });
                } 
                // Outputting if there is a company
                else if (result.rows.length > 0) { 
                    return res.status(400).json({ error: 'Company already exists' });
                } 
                // Inserting the company
                else { 
                    // Creating the companies row
                    pool.query(insertCompanyQuery, companyInfoInsert, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Server error' });
                        } 
                        // Creating the company_creation row
                        else {
                            pool.query(attachUserToCompany, userCompanyInfo, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: 'Server error' });
                                }
                                else {
                                    res.status(200).json({success: true})
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    else{
        res.status(401).json({ error: 'User not logged in!' });
    }
});


export default router;