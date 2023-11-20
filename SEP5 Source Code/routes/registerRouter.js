import express from "express";
import path from "path";
import pool from "../config/db.js";
import multer from "multer";

const router = express.Router();

// Defining storage for Multer
const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname.toLowerCase().replace(/\s/g, '-');
    const fileExtension = path.extname(originalName);
    const fileNameWithoutExtension = path.parse(originalName).name;
    const finalFileName = fileNameWithoutExtension + '-' + uniqueSuffix + fileExtension;
    callback(null, finalFileName);
    callback(null, finalFileName);
  }
});

const upload = multer({ storage: storage });

const currentDate = new Date();

// Get the current date and time components
const currentYear = currentDate.getFullYear();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const currentDay = currentDate.getDate().toString().padStart(2, '0');
const currentHours = currentDate.getHours().toString().padStart(2, '0');
const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
const currentSeconds = currentDate.getSeconds().toString().padStart(2, '0');

// Format the date and time as a string (YYYY-MM-DD HH:mm:ss)
const currentDateFormated = `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`;

router.get('/', (req,res) => {
    res.render('pages/register', {title: 'Register'})
});


router.post("/", upload.single('picture'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = '/images/' + file.filename;

  // Storing user details send by POST in the body
  const { username, password, email, subscription } = req.body;

  // Preparing user information
  const userInfo = [filePath, username, password, email, subscription, currentDateFormated];

  // Setting queries
  const checkUsernameQuery = "SELECT * FROM users WHERE username = $1";
  const insertUserQuery =
    "INSERT INTO users (image_url, username, password, email, subscription_status, registration_date) VALUES ($1,$2,$3,$4,$5,$6)";

  console.log(
    "U: " +
      username +
      ", P: " +
      password +
      ", E: " +
      email +
      ", S: " +
      subscription +
      ", R: " +
      currentDateFormated
  );

  pool.query(checkUsernameQuery, [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error");
    } else if (result.rows.length > 0) {
      // If the user already exists, send a response to the frontend
      return res.status(400).send("User already exists");
    } else {
      pool.query(insertUserQuery, userInfo, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Server error");
        } else {
          // Setting logged in cookie and session to true
          res.cookie("isLoggedIn", "true", { httpOnly: false });
          // Setting current user cookie to username
          res.cookie("currentUser", username, { httpOnly: false });
          res.status(200).redirect("/");
        }
      });
    }
  });
});

export default router;
