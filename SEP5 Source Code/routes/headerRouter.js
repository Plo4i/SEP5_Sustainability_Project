import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// A route for search bar
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const results = await pool.query("SELECT * FROM companies WHERE name ILIKE $1", [`%${query}%`]);
        res.json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;