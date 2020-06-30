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

// Sign Up request
app.get('/signup', (req, res) => {
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

// Sign Up POST request
app.post('/signup', async (req, res) => {
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
  // console.log(user);  // user dalam bentuk record object

  // Store the id of that user inside the users cookie
  req.session.userId = user.id;

  res.send('Account Created!');
});

//Sign Out request
app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are Logged Out');
});

//Sign In request
app.get('/signin', (req, res) => {
  res.send(`
  <div>
  Your id is: ${req.session.userId}
  <form method="POST">
    <input name="email" placeholder="email" />
    <input name="password" placeholder="password" />
    <button>Sign In</button>
  </form>
</div>
  `);
});

//Sign In POST request
app.post(`/signin`, async (req, res) => {
  const {
    email,
    password
  } = req.body

  //validasi email
  const user = await usersRepo.getOneBy({
    email: email
  });

  if (!user) {
    return res.send('Email not found');
  }

  //validasi password
  if (password !== user.password) {
    return res.send('Wrong password');
  }

  //set cookie session
  req.session.userId = user.id;
  res.send(`You are sign in! user with id ${req.session.userId}`);
});

//terminal
app.listen(3000, () => {
  console.log('Listening on port 3000');
});