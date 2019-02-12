// exports.database = function database(connection) {
    
    
//     /** creating database if not exists */
//     connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`, function (err, results, fields) {
//         if (err) {
//             return console.log('error: ' + err.message);
//         } else {
//             if(!results.warningCount){
//                 console.log(process.env.DATABASE_NAME+' created successfully.');
//             }
//         }
//     });

//     /** using the database */
//     connection.query(`USE ${process.env.DATABASE_NAME}`, function (err, results, fields) {
//         if (err) {
//             return console.log('error: ' + err.message);
//         } else {
//             console.log(`Selected ${process.env.DATABASE_NAME}`)
//         }
//     });
// }

const Database = {

    /** creating database if not exists */
    createDatabaseIfNotExists(connection) {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${global.gConfig.DATABASE_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, function (err, results, fields) {
            if (err) {
                return console.log('error: ' + err.message);
            } else {
                if(!results.warningCount){
                    console.log(gConfig.DATABASE_NAME+' created successfully.');
                }
            }
        });
    },
    /** using the database */
    useDatabase(connection) {
        connection.query(`USE ${gConfig.DATABASE_NAME}`, function (err, results, fields) {
            if (err) {
                return console.log('error: ' + err.message);
            } else {
                console.log(`Selected ${gConfig.DATABASE_NAME}`)
            }
        });
    }
}

export default Database;