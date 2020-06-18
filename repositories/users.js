const fs = require('fs');

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

    async create(attrs) {
        // { email: "asdasd@gmail.com", pass:"asdasda" }
        const records = await this.getAll();
        records.push(attrs);

        // write the update 'records' array back to this.filename (user.json)
        await fs.promises.writeFile(this.filename, JSON.stringify(records))
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.create({
        email: "asdad@SpeechGrammarList.com",
        pass: "asdasd"
    })

    const users = await repo.getAll();

    console.log(users);
}

test();