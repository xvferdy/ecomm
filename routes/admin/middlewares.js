const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc) {
		return (req, res, next) => {
			const errors = validationResult(req);
			// console.log(errors);

			// const { title, price } = req.body; //:poop:
			if (!errors.isEmpty()) {
				// return res.send(templateFunc({ errors }, title.replace(' ', ' '))); //itu bukan spasi tapi whitespace dari character map :poop:
				return res.send(templateFunc({ errors }));
			}
			next();
		};
	}
};
