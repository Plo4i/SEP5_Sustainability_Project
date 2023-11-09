import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";

// Import routes
import indexRouter from "./routes/index.js";
import loginRouter from "./routes/loginRouter.js";
import registerRouter from "./routes/registerRouter.js";

import companyRouter from "./routes/companyRouter.js"

// can be deleted in final.....
import test from './routes/test.js';

//import usersRouter from './routes/users.js';

// Create an instance of the Express application
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//express-session middleware to keep sessions state of logged in user
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Define routes
app.use("/", indexRouter);
app.use("/", loginRouter);
app.use("/", registerRouter);

app.use("/", test);
app.use('/',companyRouter);



//app.use('/login', loginRouter);



// Start the server and listen for incoming requests
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
