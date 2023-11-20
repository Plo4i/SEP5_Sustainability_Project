import path from 'path';
import multer from 'multer';

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

export default upload;