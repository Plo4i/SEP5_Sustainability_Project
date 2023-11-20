import express from "express";
const router = express.Router();

router.get('/', (req,res) => {
    const user = req.session.user;
    res.render('pages/user', {user: user, title: "Profile"});
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
})

export default router;