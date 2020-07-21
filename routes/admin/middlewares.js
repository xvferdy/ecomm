const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc) {
		return (req, res, next) => {
			const errors = validationResult(req);
			// console.log(errors);

			const { title, price } = req.body; //:poop:
			if (!errors.isEmpty()) {
				// return res.send(templateFunc({ errors }, title.replace(' ', ' '))); //itu bukan spasi tapi whitespace dari character map :poop:
				return res.send(templateFunc({ errors }, title));
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
