import express from "express";
import upload from "../public/scripts/mutlerComponent.js";
import fs from 'fs';
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
    JOIN users ON company_creation.user_id = users.username
    WHERE users.username = $1;`; 

  pool.query(retriveUserCompanies, [user.username], (err,results) => {
      if(err){
        console.log(err);
      }
      else {
        res.status(200).json({user: user, companies: results.rows});
      }
  });
});

router.post('/changePic', upload.single('picture'), (req, res) => {
  const user = req.session.user;
  const file = req.file;

  try {
    const filePath = '/images/' + file.filename;
    const sendInfo = [user.username, filePath];

    // Delete the existing profile picture file
    const pathToDelete = 'public' + user.image_url;
    fs.unlinkSync(pathToDelete);

    // Update the user's profile picture URL in the database
    const queryImageUpdate = `
      UPDATE users 
      SET image_url = $2
      WHERE username = $1;`;
    pool.query(queryImageUpdate, sendInfo);

    req.session.user.image_url = sendInfo[1];

    // Send the success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;