import express from "express";
import { createAdmin, getUserById, getUsers } from '../DB/db.js';
import { getPayload } from "../auth/auth.js";

const router = express.Router();

// USERS
// create a new user (admin)
router.post("/createAdmin", async (req, res)=>{
	// get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);

	// only admin can create an admin user.
	if(payload.role !== 'admin') res.status(401).send();

	// get information from client
	const body = req.body;
	// set password to null
	body.password = null;

	// check no missing fields
	if (body.name.length <= 0 || body.lastName.length <= 0 || body.phone.length <= 0) res.status(400).send();

	// save new user in database
	let result = await createAdmin(body);
	
	if(result == 0){
		console.log(payload.name, "ha creado un nuevo usuario administador: ", body.name);
		
		// create a new user in table
		res.status(201).send(JSON.stringify(body));
	}
	else{
		res.status(403).send("User Already exists.");
	}
	
});

// get all users
router.get("/users", async (req, res) => {
	// get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);

	// get aditional information
	// expected a role in query params
	const params = req.query;
    
	// get users
	const users = await getUsers(payload, params?.role);
    
	if(users){
		res.send(JSON.stringify(users));
	}else{
		res.status(401).send()
	}
});

// get user by id
router.get("/users/:id", async (req, res) => {
    // get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);
    
	// get user
	const user = await getUserById(payload, req.params.id);

	if(user){
		res.send(JSON.stringify(user));
	}else{
		res.status(401).send()
	}
});

// WARRANTY
// create a claim guarrantys
router.put("/guarranty/:id", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});


export default router;