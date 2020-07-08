const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
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
		})
};
