import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = express.Router();


router.get('/', (req,res) => {
    pool.query('SELECT * FROM companies', (err,result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
        else {
            const options = path.join(__dirname, '../views/pages')
            res.render(options+'/index.ejs', { companies: result.rows});
        }
    });
})

export default router;