import { sendMsg } from '../bot/bot.js';
import express from 'express';

const app = express();
const router = express.Router();

router.post("/login", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

router.post("/logout", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

router.post("/register", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

router.post("/contact", (req, res) => {

	// Send the msj to the group
	sendMsg(`Hola, Mi nombre es ${req.body.name} ${req.body.lastName} ${req.body.phone}. Escribo ya que necesito un@ ${req.body.category}. ${
		req.body.aditionalData ? `${req.body.aditionalData}.` : ``
	}`);

	// save the lead in the database

	// send the response to the front-end
	res.status(200).send();
});

// test endpoint
router.get("/ping", async (req, res) => {
	res.send("pong");
});

export default router;

