const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating repository require a file name");
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

    //berupa array (dari getAll())
    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        // console.log(records); // // memory array pertama kali dari getAll masih kosong
        records.push(attrs);

        // console.log(records); // memory array sdh diisi, kalau app direstart array kembali kosong
        await this.writeAll(records);
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
        return records.find(record => record.id === id); //iterate masing2 index
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        // record === { email: 'test@gmail.com }
        // attrs === { pass: 'mypass' }
        Object.assign(record, attrs);
        // record === { email: 'test@gmail.com, pass: 'mypass' }
        await this.writeAll(records);
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    // await repo.create({
    //     email: "ferdy@gmail.com",
    //     pass: "ayam"
    // })

    // const users = await repo.getAll();
    // console.log(users);

    // const user = await repo.getOne('05a175d7');
    // console.log(user);

    // await repo.delete("09d96a1a");

    await repo.update("59c99e98", {
        type: "reguler"
    });
}

test();