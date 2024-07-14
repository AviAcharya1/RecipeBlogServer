const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("./db/config");

dotenv.config();
const app = express();

// Allowed origins array
const allowedOrigins = [
  'https://recipe-blog-ui.vercel.app',
  'https://recipe-blog-grdr3ns1h-aviacharya1s-projects.vercel.app'
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log(`Origin: ${origin}`);
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

connectDB();

const Home = require("./controllers/controllers");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

// Handle preflight requests
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Connected to Database; Your Backend is running");
});

app.use("/auth", RegisterRoute);
app.use("/auth", LoginRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", ForgotPassword);

app.get("/home", verifyToken, Home.Home);

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
