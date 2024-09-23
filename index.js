import 'dotenv/config'
import express from "express";
import publicRoutes from "./src/routes/public.routes.js";
import { verifyToken } from './src/auth/auth.js';
import { getUsers } from './src/DB/db.js';
import { client } from './src/bot/bot.js';

const PORT = process.env.PORT || 3000;
const app = express();
// remove x-powered-by
app.disable('x-powered-by');

// json middleware
app.use(express.json());

app.use((req, res, next)=>{

	if(req.url.startsWith("/auth/")){
		console.log("public endpoint: ", req.url)
		next();
	}

	else{
		const auth = req.get("Authorization") || null;
		
		if(auth){``
			const validToken = verifyToken(auth.split(" ")[1]);
			console.log(validToken);
			switch(validToken){
				case "valid":
					next();
					break;
				case "expired":
					res.status(301).send(`<h1>Redirect to loging</h1>`);
					break;
				case "invalid":
					res.status(401).send(`<h1>Unauthorized ${req.url}</h1>`);
					break;
			}
		}else{
			res.status(401).send(`<h1>Unauthorized -> Authorization needed.</h1>`);
		}
	}
})

// public endpoints
app.use("/auth",publicRoutes);

// 
app.get("/dasboard", async (req, res)=>{
	const clients = await getUsers();
	res.send(JSON.stringify(clients));
});

// up server listening on specified port
app.listen(PORT, () =>
	console.log(`Example app listening on port ${PORT}!`),
);
