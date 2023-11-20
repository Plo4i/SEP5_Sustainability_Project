import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = express.Router();
const options = path.join(__dirname, '../views/pages')



router.get('/', (req,res) => {
    pool.query('SELECT * FROM companies', (err,result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
        else {
            req.session.isLoggedIn = false;
            res.cookie('isLoggedIn', 'false', {httpOnly:false});
            res.render(options+'/index.ejs', { companies: result.rows});
        }
    });
})

router.post('/', (req, res) => {
    const companyName = req.body.companyName; // Get company NAME from request body
  
    pool.query('SELECT * FROM companies', (err,result) => {
        let match = result.rows.some(row => row.name === companyName);
        if (match) {
            router.get('/company', result.rows.find(row => row.name === companyName))
        }
        else if (err){
            console.error('Here ');
            res.status(500).send('Server error');
        }
    }); 
  
    res.send(companyName);
  });

export default router;
