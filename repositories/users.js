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
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    // await repo.create({
    //     email: "asdad@SpeechGrammarList.com",
    //     pass: "asdasd"
    // })

    // const users = await repo.getAll();

    // console.log(users);

    const user = await repo.getOne('05a175d7');

    console.log(user);
}

test();