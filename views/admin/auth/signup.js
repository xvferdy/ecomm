const layout = require('../layout');

const getError = (errors, prop) => {
	try {
		return errors.mapped()[prop].msg;
	} catch (err) {
		return '';
	}

	// errors.mapped() === {
	// 		email: {
	// 			msg: 'Invalid Email'
	// 		},
	// 		password: {
	// 			msg: 'Password too short'
	// 		},
	// 		passwordConfirmation: {
	// 			msg: 'Password must match'
	// 		}
	// 	}
};

module.exports = ({ req, errors }) => {
	return layout({
		content: `
    <div>
      Your id is: ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" /> 
        ${getError(errors, 'email')}
        <input name="password" placeholder="password" /> 
        ${getError(errors, 'password')}
        <input name="passwordConfirmation" placeholder="password confirmation" /> 
        ${getError(errors, 'passwordConfirmation')}
        <button>Sign Up</button>
      </form>
    </div>
  `
	});
};
