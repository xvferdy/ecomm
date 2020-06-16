const fs = require('fs');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating repository require a file name");
        }
        this.filename = filename;
        try {
            fs.accesSync(this.filename)
        } catch (err) {
            fs.writeFileSync(this.filename, '[]')
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));

    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    const users = await repo.getAll();

    console.log(users);
}

test();