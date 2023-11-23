import express from "express";
import pool from "../config/db.js";


const router = express.Router();

// Renders the company.ejs
router.get('/', async (req,res) => {
    res.render('pages/company');
});

// Gets the data about the selected company through http query
router.get('/data', async (req,res) => {
    try {
        const companyCVR = req.query.CVR;
        const results = await pool.query("SELECT * FROM companies WHERE cvr = $1", [companyCVR]);

    if (results.rows.length === 0) {
        // If no company is found, return a 404 status
        res.status(404).json({ error: 'Company not found' });
    } else {
        // If company is found
        res.status(200).json(
            {details: results.rows[0],
            title: 'EcoEval - ' + results.rows[0].name}
        );
        
    }
} catch (error) {
    // Handle errors more gracefully
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

router.post('/delete', (req,res) => {
    const user = req.session.user.id;
    const company = req.body;
    
    const deleteQueryCompaniesCreation = `DELETE FROM company_creation
        USING companies, users
        WHERE companies.cvr = company_creation.company_id
        AND users.id = company_creation.user_id
        AND users.id = $1
        AND companies.cvr = $2;`
    const deleteQueryCompanies = `DELETE FROM companies WHERE cvr = $1;`

    // Deletion from the company_creation table
    pool.query(deleteQueryCompaniesCreation, [user, company.companyCVR], (err, results) => {
        if(err){
            console.log(err);
          }
          else {
            // Deletion from the companies table
            pool.query(deleteQueryCompanies, [company.companyCVR], (errDelete, resultsDelete) => {
                if(errDelete){
                    console.log(errDelete);
                }
                else {
                    console.log("Deleted");
                    res.status(200).json({success: true});
                };
            });
        };
    });
});

router.post('/edit', (req,res) => {
    const user = req.session.user.id;
    const company = req.body;

    const companyQuery = `SELECT * FROM companies WHERE cvr = $1;`;

    pool.query(companyQuery, [company.companyCVR], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } 
        else {
            // Check if any rows are found
            if (result.rows.length > 0) {
                // Send the first row in the response
                res.status(200).json(result.rows[0]);
            } 
            else {
                res.status(404).json({ error: 'Company not found' });
            }
        }
    });
});


export default router;
