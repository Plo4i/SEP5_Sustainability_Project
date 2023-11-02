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
router.post("/login", (req, res) => {
    //handle loggin in - auth thorugh DB
    /*
    psuedo:
    username and password: req.body.username, req.body.password
    test through DB in external file

    IF authenticated in DB the run
    req.session.isLoggedIn = true;

    In other parts of code req.session.isLoggedIn can now be used in -
      IF statements to see if user is logged in
    */

    req.session.isLoggedIn = true;
    res.cookie('isLoggedIn', 'true', {httpOnly:false});
    res.sendFile(options + "/index.html");
    /*
    res.cookie('isLoggedIn', 'true', {httpOnly:false});
 */

  });
  
  router.post("/logout", (req, res) => {
    // Handle logout logic here
  });




export default router;
