const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const router = express.Router();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error getting user data' });
      }
      res.json(JSON.parse(data));
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user data');
    }

    const user = JSON.parse(data); 

    if (user.username !== username) {
      return res.json({ status: false, message: "User Name is invalid" });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: "Password is invalid" });
    }

    res.json({ status: true, message: "User is valid" });
  });
});

module.exports = router;

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
  const { username } = req.query;
  if (username) {
      res.send(`<b>${username} successfully logged out.</b>`);
  } else {
      res.status(400).send('<b>Username not provided.</b>');
  }
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.use('/', router);

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Web Server is listening at port ${PORT}`);
});