import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session'


// Import routes
import indexRouter from './routes/index.js';
import loginRouter from './routes/loginRouter.js';

//import usersRouter from './routes/users.js';

// Create an instance of the Express application
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();



// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Define routes
app.use('/', indexRouter);
app.use('/login', loginRouter);

//express-session middleware to keep sessions state of logged in user
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));



// Start the server and listen for incoming requests
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
