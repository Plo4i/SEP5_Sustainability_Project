import express from 'express';

const router = express.Router();


//Route to log in

router.post('/login', (req,res) => {

    let name = req.body.username;
    console.log(name);

    //handle loggin in - auth thorugh DB
        //const test = req.session;
        req.session.isLoggedIn = true;
       // console.log(test)
        res.send(name);

})



router.post('/logout', (req, res) => {
    // Handle logout logic here
  });


  export default router;