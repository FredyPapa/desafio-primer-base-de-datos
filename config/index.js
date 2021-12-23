require("dotenv").config();

const config = {
    dev: process.env.NOD_ENV !== 'production',
    port: process.env.PORT,
    cors: `${process.env.CORS}`

}

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

module.exports = {config, db}