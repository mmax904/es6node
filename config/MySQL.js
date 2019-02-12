/*console.log(global.gConfig)
console.log(gConfig)*/

import mysql from 'mysql';
import Database from './Database';

var connection = mysql.createConnection({

    port     : gConfig.DATABASE_PORT,
    host     : gConfig.DATABASE_HOST,
    user     : gConfig.DATABASE_USER,
    password : gConfig.DATABASE_PASS,
    //database : process.env.DATABASE_NAME,
    timezone : gConfig.SERVER_TIMEZONE,
    dateStrings : 'datetime',
});

connection.connect(function(err) {
    if (err) {
        return console.log('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});

connection.config.queryFormat = function (query, values) {

    if (!values) return query;
    var i =-1;
    return query.replace(/\:(\w+)|\?/g, function (txt, key) {
        if(txt =='?'){
            i++;
            return this.escape(values[i]);
        } else if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};

Database.createDatabaseIfNotExists(connection);

Database.useDatabase(connection);

module.exports = connection;