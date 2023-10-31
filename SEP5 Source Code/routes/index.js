import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = express.Router();


router.get('/', (req,res) => {
    const options = path.join(__dirname, '../views/pages')


    res.sendFile(options+'/index.html',(error) => {
        //console.log("")
        //console.log("error finding file" + error);
    })

})

export default router;