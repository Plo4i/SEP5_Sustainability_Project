import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";


// Import routes
import indexRouter from "./routes/indexRouter.js";
import loginRouter from "./routes/loginRouter.js";
import userRouter from "./routes/userRouter.js";
import registerRouter from "./routes/registerRouter.js";
import companyRouter from "./routes/companyRouter.js";
import insertCompany from './routes/companyInsertRouter.js'


// Create an instance of the Express application
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();


// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//express-session middleware to keep sessions state of logged in user
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // 1 hour (in milliseconds)
    },
  })
);

// Define routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use('/user', userRouter)
app.use('/company',companyRouter);
app.use('/insertCompany', insertCompany);


// Start the server and listen for incoming requests
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
