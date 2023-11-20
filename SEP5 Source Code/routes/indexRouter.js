import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// Renders the page
router.get('/', (req,res) => {
    
            req.session.isLoggedIn = false;
            res.cookie('isLoggedIn', 'false', {httpOnly:false});
            res.render('pages/index', {title: 'Home'});
});


// Get the companies for indexScript and sets the title
router.get('/companies', (req,res) => {
    pool.query('SELECT * FROM companies', (err,result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
        else {
            res.status(200).json({companies: result.rows, title: 'Home'});
        }
    });
});

// Checks for the company and redirect to companyRouter
router.post('/company', (req,res) => {
    let companyCVR = req.query.buttonValue
    res.redirect('/company?CVR=' + companyCVR)
});

export default router;
