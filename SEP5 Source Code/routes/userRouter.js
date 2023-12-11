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
    JOIN users ON company_creation.user_email = users.email
    WHERE users.email = $1;`; 

  pool.query(retriveUserCompanies, [user.email], (err,results) => {
      if(err){
        console.log(err);
      }
      else {
        res.status(200).json({user: user, companies: results.rows});
      }
  });
});

router.post('/changePic', upload.single('picture'), async (req, res) => {
  const user = req.session.user;
  const file = req.file;

  try {
    const filePath = '/images/' + file.filename;
    const sendInfo = [user.email, filePath];

    // Delete the existing profile picture file
    const pathToDelete = 'public' + user.image_url;

    // Update the user's profile picture URL in the database
    const queryImageUpdate = `
      UPDATE users 
      SET image_url = $2
      WHERE email = $1;`;

    await pool.query(queryImageUpdate, sendInfo, (err) => {
      if(err) {
        console.log(err);
      }
      else {
        fs.promises.unlink(pathToDelete);
        req.session.user.image_url = sendInfo[1];
        return res.status(200).json({ success: true });
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/edit', (req,res) => {
  const {username, sPlan, email} = req.body;
  
  const userExistQuery = `SELECT FROM users WHERE email = $1;`;

  const updateUserQuery = `
    UPDATE users 
    SET username = $3, subscription_status = $2
    WHERE email = $1;`;

  pool.query(userExistQuery, [email], (err, result) => {
    if(err)
    {
      return res.status(400).json({ error: 'Server error' });
    }
    else if(result.rows.length > 1)
    {
      return res.status(400).json({ error: 'Username already taken' });
    }
    else {
      pool.query(updateUserQuery, [email, sPlan, username], (err) => {
        if(err)
        {
          return res.status(400).json({ error: 'Server error' });
        }
        else
        {
          res.status(200).json({'success' : true})
        }
      });
      
    };
  });
});

router.post('/delete', (req,res) => {

});


export default router;