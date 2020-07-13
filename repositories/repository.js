const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating repository require a file name');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename); //cek apakah sudah ada nama filename di folder kita
		} catch (err) {
			fs.writeFileSync(this.filename, '[]'); //jika belum ada, buat file dengan nama filename
		}
	}

	async create(attrs) {
		attrs.id = this.randomId();

		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);

		return attrs;
	}

	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			})
		);
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
};

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
