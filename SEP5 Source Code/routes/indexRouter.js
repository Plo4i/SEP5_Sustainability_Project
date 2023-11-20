import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


router.get('/', (req,res) => {
    const user = req.session.user;
    pool.query('SELECT * FROM companies', (err,result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
        else {
            req.session.isLoggedIn = false;
            res.cookie('isLoggedIn', 'false', {httpOnly:false});
            res.render('pages/index', { companies: result.rows, user: user, title: 'Home'});
        }
    });
})

router.post('/company', (req,res) => {
    let companyCVR = req.query.buttonValue
    res.redirect('/company?CVR=' + companyCVR)
});

export default router;
