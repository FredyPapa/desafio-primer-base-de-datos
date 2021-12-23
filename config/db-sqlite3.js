let knex = require("knex");

let sqlite3 = knex({
    client: "sqlite3",
    connection: {filename: "./db/ecommerce.sqlite"}
});

class DatabaseSqlite3{
    static client;
    constructor(){
        if(DatabaseSqlite3.client){
            return DatabaseSqlite3.client;
        }
        DatabaseSqlite3.client = sqlite3;
        this.client = DatabaseSqlite3.client;
    }
}

module.exports = new DatabaseSqlite3();