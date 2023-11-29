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

// Route to handle rating submission
router.post('/save-rating', async (req, res) => {
    try {
        const { liked, comment, company_id, user_id } = req.body;

        const saveRatingQuery = `
            INSERT INTO rate (liked, comment, company_id, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;
        console.log({ liked, comment, company_id, user_id });
        const saveRatingValues = [liked, comment, company_id, user_id];

        const savedRating = await pool.query(saveRatingQuery, saveRatingValues);

        // Check if the rating was successfully saved
        if (savedRating.rows.length > 0) {
            // Send the saved rating in the response
            res.status(200).json(savedRating.rows[0]);
        } else {
            // Handle the case where the rating was not saved
            res.status(500).json({ error: 'Failed to save rating' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Router for the avarage rating in the heading of the company page
router.get('/avarage-rating', async (req, res) => {
    try {
        const companyCVR = req.query.CVR;
        const reviewsQuery = `
            SELECT COUNT(*) as reviews, AVG(liked) as score 
            FROM rate 
            WHERE company_id = $1;
        `;

        const { rows } = await pool.query(reviewsQuery, [companyCVR]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'No reviews found for this company' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Router for the sidebar reviews to get the 3 most recnt reviews
router.get('/reviews-sidebar', async (req, res) => {
    try {
        const { CVR, limit } = req.query;
        const results = await pool.query(
            `SELECT Rate.*, Users.username as userName, Users.image_url as userImage
             FROM Rate 
             INNER JOIN Users ON Rate.user_id = Users.id 
             WHERE Rate.company_id = $1 
             ORDER BY Rate.date_created DESC 
             LIMIT $2`,
            [CVR, limit]
        );
        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
