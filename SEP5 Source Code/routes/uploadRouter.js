import express from "express";
import path from "path";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'public/images' });


router.post('/', upload.single('picture'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const filePath = 'public/images' + file.filename; // Relative path to the uploaded file
  
    res.send(filePath);
  });

export default router;