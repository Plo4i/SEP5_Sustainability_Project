import express from 'express';


const testRouter = express.Router();






testRouter.post("/test", (req, res) => {
    console.log("works");
    res.send("works! from test") 
 });




// user.js
export default testRouter;