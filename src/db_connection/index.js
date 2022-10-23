const mysql = require('mysql2');
const {infoLog, errorLog} = require("../utils/logger");
const {DB_HOST, DB_USER, DB_PASSWORD} = process.env;


const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
});

exports.connect = () => {
    con.connect(function(err) {
        if (err) {
            errorLog(err);
            process.exit(1);
        }
        infoLog("Successfully connected to database")
    })
};
