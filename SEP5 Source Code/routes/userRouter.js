import express from "express";
import pool from '../config/db.js';

const router = express.Router();

router.get('/', (req,res) => {
    const user = req.session.user;
    if (user != undefined)
    {
    res.render('pages/user');
    }
    else {
      res.redirect('/')
    }
});

router.get('/logout', (req, res) => {
    // Destroy the session on logout
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/');
    });
  });

router.get('/data', (req, res) => {
  const user = req.session.user;
  res.status(200).send({user}); 
});

router.get('/profile', (req, res) => {
  const user = req.session.user;

  const retriveUserCompanies = `SELECT cvr, name FROM companies 
    JOIN company_creation ON companies.cvr = company_creation.company_id
    JOIN users ON company_creation.user_id = users.id
    WHERE users.id = $1;`; 

  pool.query(retriveUserCompanies, [user.id], (err,results) => {
      if(err){
        console.log(err);
      }
      else {
        res.status(200).json({user: user, companies: results.rows});
      }
  });

});

export default router;