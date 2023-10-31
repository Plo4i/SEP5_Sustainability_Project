import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

// Import routes
import indexRouter from './routes/index.js';
//import usersRouter from './routes/users.js';

// Create an instance of the Express application
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(import.meta.url, 'public')));

// Define routes
app.use('/', indexRouter);
//app.use('/users', usersRouter);

// Start the server and listen for incoming requests
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
