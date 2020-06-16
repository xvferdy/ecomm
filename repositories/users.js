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
}

new UsersRepository('users.json');