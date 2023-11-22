const app = require("../index");
const bcrypt = require("bcrypt");

module.exports = function (app, blogData) {
  // Handle our routes
  // Home Page
  app.get("/", function (req, res) {
    res.render("index.ejs", { user: req.session.user });
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", blogData);
  });

  // Registration Page
  app.get("/register", function (req, res) {
    res.render("register.ejs");
  });

  // Route for user registration
  app.post("/register", function (req, res) {
    const { firstName, lastName, username, email, password, confirmPassword } =
      req.body;

    if (!username || !password || !firstName || !lastName || !email) {
      // Return an error response if any field is blank
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if password length is at least 8 characters
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `INSERT INTO users (firstName, lastName, username, email, password)
                VALUES (?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [firstName, lastName, username, email, hashedPassword],
      function (err, result) {
        if (err) {
          console.error("Error during registration:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        console.log("User registered successfully");
        res.redirect("/login");
      }
    );
  });

  // Login Page
  app.get("/login", function (req, res) {
    res.render("login.ejs");
  });

  // Route for user login
  app.post("/login", function (req, res) {
    const { loginUsername, loginPassword } = req.body;

    // Retrieve user from the 'users' table based on the entered username
    const sql = "SELECT * FROM users WHERE username = ?";
    const values = [loginUsername];

    db.query(sql, values, function (err, results) {
      if (err) throw err;

      if (results.length > 0) {
        // User found, compare hashed passwords
        const storedPasswordHash = results[0].password;

        const passwordMatch = bcrypt.compareSync(
          loginPassword,
          storedPasswordHash
        );

        if (passwordMatch) {
          // Passwords match, login successful
          console.log("Login successful");
          req.session.user = results[0]; // Store user data in session
          res.redirect("/");
        } else {
          // Passwords do not match, login failed
          console.log("Incorrect password");
          res.redirect("/login");
        }
      } else {
        // User not found, login failed
        console.log("User not found");
        res.redirect("/login");
      }
    });
  });
};
