const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	//berupa array (dari getAll())
	async create(attrs) {
		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attrs.password, salt, 64); // masih berupa buffer
		console.log(scrypt);

		const records = await this.getAll();
		const record = {
			...attrs,
			password: `${buf.toString('hex')}.${salt}` //overwrite password asli user dengan password hash+salt.salt
		};
		records.push(record); //masih di memory array belum di writeAll() ke harddrive

		await this.writeAll(records);

		return record;
	}

	async comparePassword(saved, supplied) {
		// Saved -> password saved in our database, hashed.salt
		// supplied -> password given to us by a user trying sign in
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuf.toString('hex');
	}
}

module.exports = new UsersRepository('users.json');
