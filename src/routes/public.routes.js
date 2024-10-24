import express from 'express';
import { createLead, getUsers, login, register } from '../DB/db.js';
// uncoment this to active whatsapp 
// import { sendMsg } from '../bot/bot.js';


const router = express.Router();

router.post("/login", async (req, res) => {

	const { user, password } = req.body;
	// console.log("body:", user, password)
	const result = await login({ user, password });

	if (result) {
		res.status(200).send(JSON.stringify({ token: result.token, role: result.role,expires: new Date(Date.now() + 3 * 24 * 3600000) }));
	}
	else {
		res.status(401).send('User not found.');
	}
});

router.post("/logout", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

router.post("/register", async (req, res) => {
	const { name, lastName, phone, password } = req.body;

	if (name.length <= 0 || lastName.length <= 0 || phone.length <= 0 || password.length <= 0) res.status(400).send();

	let result = await register({ name, lastName, phone, password });

	if (result == 0) res.status(201).send("User created.");
	else res.status(403).send("User Already exists.");

});

router.post("/contact", (req, res) => {

	const { name, lastName, phone, category, aditionalData } = req.body;

	if (name.length <= 0 || lastName.length <= 0 || phone.length <= 0) res.status(400).send();

	else {
		let note = `Hola, Mi nombre es ${name} ${lastName} ${phone}. Escribo ya que necesito un@ ${category}. ${aditionalData ? `${aditionalData}.` : ``}`;

		// save the lead in the database
		// const result = createLead(note);

		// Send the msj to the group
		// uncoment this to active whatsapp 
		// sendMsg
		console.log(`_PabloBot_
*_Cliente potencial_* 
${note}

ext: ${process.env.FRONTEND_DOMAIN}?name=${name}&lastName=${lastName}&phone=${phone}
			`);

		// send the response to the front-end
		res.status(200).send();
	}

});

// test endpoint
router.post("/ping", async (req, res) => {
	// // getting query params from url
	// // localhost:3000/auth/ping?name=Pablo&lastName=Vergara&phone=04245250232
	console.log(req.body);
	// // redirect to private endpoint
	// res.redirect(`${process.env.BACKEND_DOMAIN}`)
	res.send("<h1>ok</h1>")
});


export default router;

