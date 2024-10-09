import 'dotenv/config' //  get dotenv config
import mysql from 'mysql2/promise'; // Get mysql client
import { createHmac } from 'crypto';
import { createToken } from '../auth/auth.js';


// Create the connection to database
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// UTIL 
async function getIdLastRecord(table) {
  const [results] = await connection.query(`select id from ${table} order by id desc limit 1;`)
  return results[0].id
}

function createPassword(password) {
  return createHmac('sha1', process.env.SECRET)
    .update(password)
    .digest('hex');
}

// LEADS 
export async function createLead(message) {
  try {
    const result = await connection.query(`INSERT INTO leads(message) VALUES(?)`, [message]);
    return result[0].insertId;

  } catch (error) {
    console.log("Error trying to insert new Client: ", error)
    return -1
  }
}

// USERS
export async function getUsers() {
  try {
    const [results] = await connection.query('SELECT * FROM clients where role="user"');
    // console.log(results); // results contains rows returned by server
    return results;
  } catch (err) {
    console.log(err);
  }
}

export async function login(credentials) {
  // execute the query
  const [results] = await connection.query(`SELECT * FROM clients WHERE phone=?`, [credentials.user]);

  // get the user info as an object omiting password
  const cleanedResult = results.length > 0 ? Object.fromEntries(Object.entries(results[0]).filter(e => e[0] != 'password')) : null;

  if (!cleanedResult) return null;

  const hash = createPassword(credentials.password)

  if (results[0].password == hash) {
    // TODO
    const token = createToken(cleanedResult);
    // save jwt
    saveJWT(token, cleanedResult.id);
    return token;
  }

  else return null;

}

export async function register(credentials) {
  const [results] = await connection.query(`SELECT * FROM clients WHERE phone=?`, [credentials.phone]);


  // see if there is already a user with that information
  if (results[0]) {
    // If yes, check that it does not have a password.
    if (!results[0].password) {
      // If you do not have a password, we will overwrite the data
      try {

        const encodedPassword = createPassword(credentials.password);
        const result = await connection.query(`UPDATE clients SET password=? WHERE id=?`, [encodedPassword, results[0].id]);
        /*
            TODO
        */
        // return the jwt
        return result[0].insertId;

      } catch (error) {
        console.log("Error trying to edit Client: ", error)
        return -1
      }

      // otherwise returns -1
    } else {
      console.log("Error: user already created.");
      return -1;
    }
    // In case it is not in the database, we create the user with the information
  } else {
    try {

      const encodedPassword = createPassword(credentials.password);
      const result = await connection.query(`INSERT INTO clients(name, lastName, phone, password) VALUES(?,?,?,?)`, [credentials.name, credentials.lastName, credentials.phone, encodedPassword]);

      // return the jwt
      return result[0].insertId;

    } catch (error) {
      console.log("Error trying to insert new Client: ", error)
      return -1
    }
  }

}

// TOKENS
export async function removeToken(token) {
  const [results] = await connection.query(`DELETE FROM jwt WHERE jwt=?`, [token]);
  // console.log(results);
}

async function saveJWT(token, id) {
  const [results] = await connection.query(`INSERT INTO jwt(jwt, userID) VALUES(?,?)`, [token, id]);
  // console.log(results);
}

//  JOBS 
export async function createJob(data) {
  // return the index of the insert row
  // otherwise -1 if there's an error.
  try {
    const [results] = await connection.query(`INSERT INTO jobs(owner, client, category, warranty_expiration_date, price, note, warranty_coverage) VALUES(?,?,?,?,?,?,?);`, [data.owner, data.client, data.category, new Date(data.warranty_expiration_date).toISOString().split("T")[0], data.price, data.note, data.warranty_coverage]);
    console.log("New job created successfully");

    // getting last record's id
    const lastId = await getIdLastRecord("jobs")

    // return id
    return lastId
  } catch (error) {
    console.error("Error creating new job", error);
    return -1;
  }

}

export async function getJob(data) {
  try {
    if (data.role === "admin") {
      const [rows] = await connection.query(`SELECT * FROM jobs`);
      return rows;
    } else {
      const [rows] = await connection.query(`SELECT * FROM jobs WHERE client=?`, [data.id]);
      return rows;
    }
  } catch (error) {
    console.error("Error getting jobs information: ", error);
    return null;
  }
}

export async function getJobById(payload, id) {
  // return the job if it exists in the DB
  // otherwise return null
  try {
    // if admin can view all jobs 
    if (payload.role === "admin") {
      const [rows] = await connection.query(`SELECT * FROM jobs where id=?`, [id]);
      return rows[0];
    }
    // if user, only can view their jobs 
    else {
      const [rows] = await connection.query(`SELECT * FROM jobs WHERE id=?`, [id]);
      return (rows[0].client == data.id) ? rows : null;
    }
  } catch (error) {
    console.error("Error getting jobs information: ", error);
    return null;
  }
}

export async function updateJob(job) {
  try {
    
    const [rows] = await connection.query(`UPDATE jobs SET owner=?, client=?, category=?, update_date=?, warranty_expiration_date=?, warranty_coverage=?, price=?, note=?,  status=?, payment_status=?WHERE id=?`,[job.owner, job.client, job.category, job.update_date, job.warranty_expiration_date, job.warranty_coverage, job.price, job.note, job.status, job.payment_status, job.id]);
    
    console.log(rows[0]);
    
    return rows[0];
  
  } catch (error) {
  }
}
