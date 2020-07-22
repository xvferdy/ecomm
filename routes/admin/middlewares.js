const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc, dataCb) {
		return async (req, res, next) => {
			const errors = validationResult(req);
			// console.log(errors);

			if (!errors.isEmpty()) {
				let data = {};

				if (dataCb) {
					data = await dataCb(req);
				}
				// console.log(data); //{product: { title: 'inca fire', price: 1, id: '7b414205', image: '' }}
				return res.send(templateFunc({ errors, ...data }));
			}
			next();
		};
	},
	requireAuth(req, res, next) {
		if (!req.session.userId) {
			console.log('>>>> Need to signin! <<<<');
			res.redirect('/signin');
		}
		next();
	}
};
