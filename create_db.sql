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

# Create the 'tips' table
CREATE TABLE tips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  image VARCHAR(255),
  link VARCHAR(255),
  userID INT,
  FOREIGN KEY (userID) REFERENCES users(id)
);
