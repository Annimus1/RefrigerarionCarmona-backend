// import { sendMsg } from '../bot/bot.js';
import express from 'express';
import { createLead, getUsers, login, register } from '../DB/db.js';
import { sendMsg } from '../bot/bot.js';


const app = express();
const router = express.Router();

router.post("/login", async (req, res) => {

	const { user, password } = req.body;
	const result = await login({ user, password });

	if (result) {
		res.setHeader('Authorization', `Bearer ${result}`);
		res.send(JSON.stringify({token: result}));
	}
	else {
		res.status(401).send();
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

	if (result == 0) res.send("User created.");
	else res.status(403).send("User Already exists.");

});

router.post("/contact", (req, res) => {

	const { name, lastName, phone, category, aditionalData } = req.body;
	
	if (name.length <= 0 || lastName.length <= 0 || phone.length <= 0 ) res.status(400).send();
	
	else {
		let note = `Hola, Mi nombre es ${name} ${lastName} ${phone}. Escribo ya que necesito un@ ${category}. ${aditionalData ? `${aditionalData}.` : ``}`;

		// save the lead in the database
		const result = createLead(note);

		// Send the msj to the group
		sendMsg(`_PabloBot_
*_Cliente potencial_* 
${note}

ext: ${process.env.BACKEND_DOMAIN}auth/ping?name=${name}&lastName=${lastName}&phone=${phone}
			`);

		// send the response to the front-end
		res.status(200).send();
	}

});

// test endpoint
router.get("/ping", async (req, res) => {
	console.log(req.query);
	res.redirect(`${process.env.BACKEND_DOMAIN}`)
	// res.send("<h1>ok</h1>")
});


export default router;

