//  get dotenv config
import 'dotenv/config'
// Get the client
import mysql from 'mysql2/promise';
import { createHmac } from 'crypto';

function createPassword(password){
    return createHmac('sha1', process.env.SECRET)
    .update(password)
    .digest('hex');
}

// Create the connection to database
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export async function getUsers() {
    try {
        const [results] = await connection.query('SELECT * FROM users');
        // console.log(results); // results contains rows returned by server
        return results;
    } catch (err) {
        console.log(err);
    }
}

export async function createLead(message){
    try{
        const result = await connection.query(`INSERT INTO leads(message) VALUES(?)`,[message]);
        return result[0].insertId;
    
    } catch (error){
        console.log("Error trying to insert new Client: ",error)
        return -1
    }
}

export async function login(credentials) {
    // execute the query
    const [results] = await connection.query(`SELECT * FROM clients WHERE phone=?`,[credentials.user]);

    // get the user info as an object omiting password
    const cleanedResult = results.length > 0 ? Object.fromEntries(Object.entries(results[0]).filter(e => e[0] != 'password')) : null;

    if (!cleanedResult) return null;

    const hash = createPassword(credentials.password)
    
    if( results[0].password == hash) {
        // TODO
        // create jwt
		// save jwt
		// send jwt
        return cleanedResult;
    }

    else return null;

}

export async function register(credentials){
    const [results] = await connection.query(`SELECT * FROM clients WHERE phone=?`,[credentials.phone]);


    // see if there is already a user with that information
    if(results[0]){
        // If yes, check that it does not have a password.
        if(!results[0].password){
            // If you do not have a password, we will overwrite the data
            try{

                const encodedPassword = createPassword(credentials.password);
                const result = await connection.query(`UPDATE clients SET password=? WHERE id=?`,[encodedPassword, results[0].id]);
                /*
                    TODO
                */
                // return the jwt
                return result[0].insertId;
            
            } catch (error){
                console.log("Error trying to edit Client: ",error)
                return -1
            }
        
            // otherwise returns -1
        }else{
            console.log("Error: user already created.");
            return -1;
        }    
    // In case it is not in the database, we create the user with the information
    }else{
        try{

            const encodedPassword = createPassword(credentials.password);
            const result = await connection.query(`INSERT INTO clients(name, lastName, phone, password) VALUES(?,?,?,?)`,[credentials.name, credentials.lastName, credentials.phone, encodedPassword]);
            
            // return the jwt
            return result[0].insertId;
        
        } catch (error){
            console.log("Error trying to insert new Client: ",error)
            return -1
        }
    }
    
}