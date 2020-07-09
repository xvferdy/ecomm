const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExist,
	requireValidPasswordForUser
} = require('./validators');

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

	if (!errors.isEmpty()) {
		return res.send(signupTemplate({ req: req, errors }));
	}

	const { email, password, passwordConfirmation } = req.body;

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
router.post('/signin', [ requireEmailExist, requireValidPasswordForUser ], async (req, res) => {
	const errors = validationResult(req);
	// console.log(errors);

	if (!errors.isEmpty()) {
		return res.send(signinTemplate({ req: req, errors }));
	}

	const { email } = req.body;

	const user = await usersRepo.getOneBy({
		email: email
	});

	//set cookie session
	req.session.userId = user.id;
	res.send(`You are sign in! user with id ${req.session.userId}`);
});

module.exports = router;
