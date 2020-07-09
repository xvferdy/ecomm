const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating repository require a file name');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			})
		);
	}

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

	// mengedit data asli pada harddrive (diambil dari memory array getAll())
	async writeAll(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id); //iterate masing2 index
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}

		Object.assign(record, attrs);
		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true; // knp pas iterasi selanjutnya found kembali menjadi true? liat di note
			// found = true;
			// console.log(found + " outter");

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
				// console.log(found + " inner");
			}

			if (found) {
				return record;
			}
		}
	}
}

// //>> HANYA UNTUK TES DATABASE METHOD <<
// const test = async () => {
//     const repo = new UsersRepository('users.json');

//     // await repo.create({
//     //     email: "ferdy@gmail.com",
//     //     password: "ayam"
//     // });

//     // const users = await repo.getAll();
//     // console.log(users);

//     // const user = await repo.getOne('05a175d7');
//     // console.log(user);

//     // await repo.delete("09d96a1a");

//     // await repo.update("59c99e98", {
//     //     email: "gmail22222222222222",
//     //     pass: "ayam22"
//     // });

//     // const user = await repo.getOneBy({
//     //     email: "ayam22",
//     //     password: "reguler"
//     // });
//     // console.log(user);
// }
// test();

module.exports = new UsersRepository('users.json');
