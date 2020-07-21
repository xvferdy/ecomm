const express = require('express');

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
const { handleErrors } = require('./middlewares');

const router = express.Router();

// Sign Up request (show signup html)
router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req: req })); //isi destruct kosong {} juga tidak apa2
});

// Sign Up POST request
router.post(
	'/signup',
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(signupTemplate),
	async (req, res) => {
		// console.log(req.body);

		const { email, password } = req.body;

		// Create a user in our user repo to represent this person
		const user = await usersRepo.create({
			email: email,
			password: password
		});
		// console.log(user);  // user dalam bentuk record object

		// Store the id of that user inside the users cookie
		req.session.userId = user.id;

		res.redirect('/admin/products/');
	}
);

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
router.post(
	'/signin',
	[ requireEmailExist, requireValidPasswordForUser ],
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({
			email: email
		});

		//set cookie session
		req.session.userId = user.id; //userId / beri nama apa saja
		res.redirect('/admin/products/');
	}
);

module.exports = router;
