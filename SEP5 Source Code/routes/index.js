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




export default router;
