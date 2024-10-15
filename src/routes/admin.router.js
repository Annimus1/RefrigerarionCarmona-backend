import express from "express";
import { getUserById, getUsers } from '../DB/db.js';
import { getPayload } from "../auth/auth.js";

const router = express.Router();

// TODO
// create a new user (admin)
router.post("/createAdmin", async (req, res)=>{
	res.status(501);
	res.send("No Implemented")
});

// USERS
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
    
	res.send(JSON.stringify(users));
});

// get user by id
router.get("/users/:id", async (req, res) => {
    // get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);
    
	// get user
	const user = await getUserById(payload, req.params.id);

	res.send(JSON.stringify(user));
});

// create a claim guarrantys
router.put("/guarranty/:id", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});


export default router;