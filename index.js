const express = require('express');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  cookieSession({
    keys: ['jekyll123']
  })
);

app.get('/', (req, res) => {
  res.send(`
    <div>
    Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation" />
      <button>Sign Up</button>
    </form>
  </div>
    `);
});

// Sign Up
app.post('/', async (req, res) => {
  // console.log(req.body);

  const {
    email,
    password,
    passwordConfirmation
  } = req.body

  //validasi email
  const existingUser = await usersRepo.getOneBy({
    email: email
  });
  if (existingUser) {
    return res.send('Email sudah digunakan!');
  }
  //validasi password
  if (password !== passwordConfirmation) {
    return res.send('Password must match!');
  }

  // Create a user in our user repo to represent this person
  const user = await usersRepo.create({
    email: email,
    password: password
  });
  // console.log(user);

  // Store the id of that user inside the users cookie
  req.session.userId = user.id;

  res.send('Account Created!');
});

//terminal
app.listen(3000, () => {
  console.log('Listening on port 3000');
});