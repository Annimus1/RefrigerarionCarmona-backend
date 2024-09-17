//  get dotenv config
import 'dotenv/config'
// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
});


async function getUsers() {
    try {
        const [results] = await connection.query('SELECT * FROM users');
        console.log(results); // results contains rows returned by server
    } catch (err) {
        console.log(err);
    }
}

function test(){
    console.log('test');
}

export default getUsers;