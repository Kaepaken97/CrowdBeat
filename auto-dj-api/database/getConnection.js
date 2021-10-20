import sql from 'mssql';

var connection = null;
async function getConnection() {
    if(connection == null)
        await connect();
    return connection;
}

async function connect() {
    try {
        let conn = await sql.connect(config);
        
        connection = conn;
        console.log("DB Connection Successful");
    } catch (err){
        console.log("DB Connection Failure:", err);
    }
}



// getConnection(function (conn) {
//     conn.query("select 1;");
// });

// async function getConnection(callback) {
//     callback(await sql.connect(config));
// }

const config = {
    user: 'SA',
    password: 'Mouser20!',
    server: '192.168.0.29',
    database: 'AutoDJ',
    options: {
        trustServerCertificate: true
    }
}

export default getConnection;