const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
	requireTitle: check('title').trim().isLength({ min: 5, max: 40 }).withMessage('Must be betwen 4 and 20 characters'),
	requirePrice: check('price').trim().toFloat().isFloat({ min: 1 }).withMessage('Must be greater than 1'),
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email address')
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email: email });
			if (existingUser) {
				throw new Error('Email sudah digunakan!');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be betwen 4 and 20 characters please buddy'),
	requirePasswordConfirmation: check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be betwen 4 and 20 characters')
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('Password must match!');
			} else {
				return true;
			}
		}),
	requireEmailExist: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must provide a valid email')
		.custom(async (email) => {
			//isi argumen diatas adalah value / bisa dinamakan apa saja
			const user = await usersRepo.getOneBy({ email: email });
			if (!user) {
				throw new Error('Email not found');
			}
		}),
	requireValidPasswordForUser: check('password').trim().custom(async (password, obj) => {
		const user = await usersRepo.getOneBy({
			email: obj.req.body.email
		});
		if (!user) {
			throw new Error('Wrong password/user');
		}

		const validPassword = await usersRepo.comparePassword(user.password, password);
		if (!validPassword) {
			throw new Error('Wrong password');
		}
	})
};
