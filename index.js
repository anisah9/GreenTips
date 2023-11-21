// Import the modules
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");

// Create the express application object
const app = express();
const port = 8000;
const mysql = require("mysql");
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Define the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "appuser",
  password: "app2027",
  database: "greentips",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

// Set up css
app.use(express.static(__dirname + "/public"));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set("views", __dirname + "/views");

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine("html", ejs.renderFile);

// Define our data
var tipData = { blogName: "GreenTips" };

//Requires the main.js files inside the routes folder
require("./routes/main")(app, tipData);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;
