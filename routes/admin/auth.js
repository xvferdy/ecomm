const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const { requireEmail, requirePassword, requirePasswordConfirmation } = require('./validators');

const router = express.Router();

// Sign Up request (show signup html)
router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req: req }));
});

// Sign Up POST request
router.post('/signup', [ requireEmail, requirePassword, requirePasswordConfirmation ], async (req, res) => {
	// console.log(req.body);

	const errors = validationResult(req);
	console.log(errors);

	//validasi
	const { email, password, passwordConfirmation } = req.body;

	//validasi email

	//validasi password

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
router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are Logged Out');
});

//Sign In request (show signin html)
router.get('/signin', (req, res) => {
	res.send(signinTemplate({ req: req }));
});

//Sign In POST request
router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	//validasi email
	const user = await usersRepo.getOneBy({
		email: email
	});

	if (!user) {
		return res.send('Email not found');
	}

	//validasi password
	const validPassword = await usersRepo.comparePassword(user.password, password);
	if (!validPassword) {
		return res.send('Wrong password');
	}

	//set cookie session
	req.session.userId = user.id;
	res.send(`You are sign in! user with id ${req.session.userId}`);
});

module.exports = router;
