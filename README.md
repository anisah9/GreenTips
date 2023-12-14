# GreenTips

//How to get into GreenTips

If server is running use the following link [www.doc.gold.ac.uk/usr/584]

If there are server issues, download code from github (https://github.com/anisah9/GreenTips.git)
and do the following in terminal:

1. In terminal npm init, npm install, npm install bcrypt, npm install ejs, npm install express, npm install mysql, npm install express-session
2. Go into Sql: /usr/local/mysql/bin/mysql -u root -p [on mac]
   Run MySQL Command Line Client from start menu [on windows]
   sudo mysql(no root password) [on linux]
   mysql -u root -p (root password) [on mac]
3. Type in sql SOURCE create_db.sql;
4. Type in sql SOURCE insert_testdata.sql;
5. Type exit
6. Type in node index.js
7. On web browser type in 'localhost:8000'

The website should load now.
