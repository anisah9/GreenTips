const app = require("../index");
const request = require("request");
const { check, validationResult } = require("express-validator");

module.exports = function (app, blogData) {
  // Handle our routes
  // Home Page
  app.get("/", function (req, res) {
    res.render("index.ejs", { user: req.session.user });
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", blogData);
  });

  // Logout
  app.post("/logout", function (req, res) {
    // Clear the session
    req.session.destroy(function (err) {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.redirect("/");
    });
  });

  // Registration Page
  app.get("/register", function (req, res) {
    res.render("register.ejs");
  });

  const bcrypt = require("bcrypt");

  app.post(
    "/register",
    [
      check("email").isEmail().withMessage("Invalid email address"),
      check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
          "Password must contain at least one uppercase letter and one number"
        ),
    ],
    function (req, res) {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      } = req.body;

      // Check for other required fields
      if (!username || !password || !firstName || !lastName || !email) {
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

      // Validate email using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      // Query the database to check if the username already exists
      const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
      db.query(checkUsernameSql, [username], function (err, results) {
        if (err) {
          console.error("Error checking username:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length > 0) {
          // Username already exists
          return res.status(400).json({ message: "Username already in use" });
        }

        // Hash the password before storing it in the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert the user into the database
        const insertUserSql = `INSERT INTO users (firstName, lastName, username, email, password)
                VALUES (?, ?, ?, ?, ?)`;

        db.query(
          insertUserSql,
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
    }
  );

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
          res.redirect("/login?error=auth");
        }
      } else {
        // User not found, login failed
        console.log("User not found");
        res.redirect("/login?error=auth");
      }
    });
  });

  app.get("/submitTip", function (req, res) {
    // Check if the user is logged in
    if (!req.session.user) {
      // Redirect to the login page if not logged in
      return res.redirect("/login");
    }

    // Render the "Submit a Tip" page if logged in
    res.render("submitTip.ejs");
  });

  app.post("/submitTip", function (req, res) {
    const { tipCategory, tipText, tipImage, tipLink } = req.body;

    if (!tipCategory || !tipText) {
      return res
        .status(400)
        .json({ message: "Category and tip text are required" });
    }

    // Get user information from the session
    console.log("Current user:", req.session.user);
    const currentUser = req.session.user;

    if (!currentUser) {
      // Redirect to login if the user is not logged in
      return res.redirect("/login");
    }

    // Save the tip to the database, associating it with the current user
    const sql = `INSERT INTO tips (category, text, image, link, userId, upvotes, keywords) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      tipCategory,
      tipText,
      tipImage,
      tipLink,
      currentUser.id,
      0,
      new Date(),
      "keyword1, keyword2",
    ];

    db.query(sql, values, function (err, result) {
      if (err) {
        console.error("Error submitting tip:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      console.log("Tip submitted successfully");
      res.redirect("/tips/" + tipCategory); // Redirect to a page that displays all tips
    });
  });
  app.get("/tips/:category", function (req, res) {
    const category = req.params.category;

    // Log the category to check if it's correct
    console.log("Category:", category);

    // Retrieve tips for the specified category from the database
    const sql =
      "SELECT tips.*, users.username FROM tips JOIN users ON tips.userId = users.id WHERE tips.category = ?";
    db.query(sql, [category], function (err, tips) {
      if (err) {
        console.error("Error retrieving tips:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Log the result of the database query
      console.log("Tips data:", tips);

      // Render the category page with the retrieved tips
      res.render("category.ejs", { category, tips });
    });
  });

  app.get("/tips", function (req, res) {
    const user = req.session.user || null;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder || "DESC";

    const sql = `
      SELECT tips.*, users.username, DATE_FORMAT(tips.created_at, '%M %e, %Y %h:%i %p') AS formattedCreatedAt
      FROM tips
      JOIN users ON tips.userID = users.id
      ORDER BY ${sortBy} ${sortOrder}
    `;

    db.query(sql, function (err, tips) {
      if (err) {
        console.error("Error retrieving tips:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      console.log("Tips data:", tips); // Add this line to check the structure of tips

      res.render("tips.ejs", { tips, sortBy, sortOrder, user });
    });
  });

  app.post("/upvote/:tipId", function (req, res) {
    const tipId = req.params.tipId;

    // Check if the user is logged in
    if (!req.session.user) {
      // Redirect or handle the case when the user is not logged in
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    // Check if the user has already upvoted this tip
    const checkUpvoteSql =
      "SELECT * FROM upvotes WHERE userId = ? AND tipId = ?";
    db.query(checkUpvoteSql, [userId, tipId], function (err, results) {
      if (err) {
        console.error("Error checking upvote:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length > 0) {
        // User has already upvoted this tip
        console.log("User has already upvoted this tip");
        // Display a window alert using JavaScript and redirect back to the previous page
        return res.send(
          "<script>alert('You have already upvoted this tip'); window.location.href = document.referrer;</script>"
        );
      }

      // User has not upvoted, proceed with the upvote
      const upvoteSql = "INSERT INTO upvotes (userId, tipId) VALUES (?, ?)";
      db.query(upvoteSql, [userId, tipId], function (err, result) {
        if (err) {
          console.error("Error upvoting tip:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Update the upvotes count in the tips table
        const updateUpvotesSql =
          "UPDATE tips SET upvotes = upvotes + 1 WHERE id = ?";
        db.query(updateUpvotesSql, [tipId], function (err, result) {
          if (err) {
            console.error("Error updating upvotes count:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          // Redirect back to the category page after upvoting
          res.redirect(req.get("referer"));
        });
      });
    });
  });

  app.get("/search", function (req, res) {
    const query = req.query.q; // Assuming the search query is passed as a query parameter

    // Perform a search query on the tips table with formatted date and time
    const sql = `
      SELECT tips.*, users.username, DATE_FORMAT(tips.created_at, '%M %e, %Y %h:%i %p') AS formattedCreatedAt
      FROM tips
      JOIN users ON tips.userID = users.id
      WHERE tips.text LIKE ? OR tips.keywords LIKE ?
    `;
    const searchQuery = `%${query}%`;
    db.query(sql, [searchQuery, searchQuery], function (err, tips) {
      if (err) {
        console.error("Error performing search:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Render the search results page
      res.render("searchResults.ejs", { tips, query });
    });
  });

  app.get("/airpollution", function (req, res) {
    let apiKey = "1aef0792cad95761fc691e7c8546da70";
    let latitude = "51.5072";
    let longitude = "-0.1276";
    let url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    // Make a request to the OpenWeatherMap API
    request(url, function (err, response, body) {
      if (err) {
        console.log("error:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Parse the JSON response
        const data = JSON.parse(body);

        // Format the air pollution data
        const formattedData = formatAirPollutionData(data);

        // Send the formatted data as a response
        res.send(formattedData);
      }
    });
  });

  // Function to format air pollution data
  function formatAirPollutionData(data) {
    if (!data || !data.list || data.list.length === 0) {
      return "No air pollution data available.";
    }

    const location = data.coord || {};
    const aqi = data.list[0].main ? data.list[0].main.aqi : "N/A";
    const components = data.list[0].components || {};

    // Create a formatted message or HTML
    const formattedMessage = `
      <h1>Air Pollution Data</h1>
      <p>Location: ${location.lat}, ${location.lon}</p>
      <p>Air Quality Index (AQI): ${aqi}</p>
      <p>Components:</p>
      <ul>
        <li>CO: ${components.co || "N/A"}</li>
        <li>NO: ${components.no || "N/A"}</li>
        <li>NO2: ${components.no2 || "N/A"}</li>
        <li>O3: ${components.o3 || "N/A"}</li>
        <li>SO2: ${components.so2 || "N/A"}</li>
        <li>PM2.5: ${components.pm2_5 || "N/A"}</li>
        <li>PM10: ${components.pm10 || "N/A"}</li>
        <li>NH3: ${components.nh3 || "N/A"}</li>
      </ul>
    `;

    return formattedMessage;
  }

  app.get("/maps", function (req, res) {
    // Render the maps.ejs file
    res.render("maps.ejs");
  });

  // Add this route to check username availability
  app.get("/check-username", function (req, res) {
    const username = req.query.username;

    // Query the database to check if the username already exists
    const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkUsernameSql, [username], function (err, results) {
      if (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length > 0) {
        // Username already exists
        return res.json({ exists: true });
      }

      // Username is available
      return res.json({ exists: false });
    });
  });
};
