CREATE DATABASE greentips;
USE greentips;

# Create the user which the web app will use to access the database
DROP USER IF EXISTS 'greentipsapp'@'localhost';
CREATE USER 'greentipsapp'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qwerty';
GRANT ALL PRIVILEGES ON greentips.* TO 'greentipsapp'@'localhost';

# Create the 'users' table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);


CREATE TABLE tips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  link VARCHAR(255),
  userID INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  upvotes INT NOT NULL DEFAULT 0,
  keywords VARCHAR(255),
  FOREIGN KEY (userID) REFERENCES users(id)
);


# Create the upvotes table
CREATE TABLE upvotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  tipId INT,
  UNIQUE KEY unique_upvote (userId, tipId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (tipId) REFERENCES tips(id)
);