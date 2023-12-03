import express from "express";
import pool from "../config/db.js";
import fs from 'fs';
import upload from '../public/scripts/mutlerComponent.js';
import formatedDate from '../public/scripts/getTimeStamp.js';


const router = express.Router();

// Renders the company.ejs
router.get('/', async (req, res) => {
    if (req.session.user !== undefined) {
        res.render('pages/companyInsert');
    } else {
        res.redirect('/');
    }
});

router.post('/', upload.single('logo'), (req, res) => {
    if(req.session.user != undefined) {

        // Getting the data
        const file = req.file;
        const { name, cvr, email, website, industry, description } = req.body;

        const userCompanyInfo = [cvr, req.session.user.username, formatedDate];
        
        // Scripts for SQL Queries
        const companyExistsQuery = `SELECT * FROM companies WHERE cvr = $1;`;
        
        const companyUpdateQuery = 
        `UPDATE companies 
        SET name = $1, email = $3, website = $4, industry = $5, description = $6, image_url = $7
        WHERE cvr = $2;`

        const companyUpdateImageQuery = 
        `UPDATE companies 
        SET name = $1, email = $3, website = $4, industry = $5, description = $6, image_url = $7
        WHERE cvr = $2;`

        const checkCVRQuery = "SELECT * FROM companies WHERE cvr = $1";

        const insertCompanyQuery = 
        `INSERT INTO companies 
        (name, image_url, cvr, email, website, industry, description) 
        VALUES ($1, $7, $2, $3, $4, $5, $6)`;

        const attachUserToCompany = 
        `INSERT INTO company_creation 
        (company_id, user_id, creationdate) 
        VALUES ($1, $2, $3);`;
  
        
        // Check if image is uploaded. Maybe the user want to update company.
        if (!file) {
            const defaultPic = '/images/question.png'
            const companyInfoUpdate= [name, cvr, email, website, industry, description, defaultPic];

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
                }
                else {
                    pool.query(insertCompanyQuery, companyInfoUpdate, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Server error' });
                        } 
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
                };
            });
        }
        // We have a file so we have to see if user wants a new company
        else {
            const filePath = '/images/' + file.filename;
            const companyInfoInsert = [name, cvr, email, website, industry, description, filePath];

            pool.query(checkCVRQuery, [cvr], (err, result) => { //Checking if there is already one
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error' });
                } 
                // If company exists
                else if (result.rows.length > 0) { 
                    pool.query(companyUpdateImageQuery, companyInfoInsert);
                    
                    const pathToDelete = 'public' + result.rows[0].image_url;
                    fs.unlinkSync(pathToDelete);

                    res.status(200).json({success: true})
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
                        };
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