let {db} = require("./index");
let knex = require("knex");

let mysql = knex({
    client: "mysql",
    connection: {
        ...db
    },
    pool: {min: 0, max: 7}
})

class DatabaseMySql{
    static client;
    constructor(){
        if(DatabaseMySql.client){
            return DatabaseMySql.client;
        }
        DatabaseMySql.client = mysql;
        this.client = DatabaseMySql.client;
    }
}

module.exports = new DatabaseMySql();