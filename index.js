import 'dotenv/config'
import express from "express";
import publicRoutes from "./src/routes/public.routes.js";
import getUsers from './src/DB/db.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

// json middleware
app.use(express.json());

app.use((req, res, next)=>{
	if(req.url.startsWith("/auth/")){
		console.log("public endpoint: ", req.url)
		next();
	}
	else{
		console.log("private endpoint: ", req.url)
		res.status(401).send(`<h1>Unauthorized ${req.url}</h1>`);
	}
})

// public endpoints
app.use(publicRoutes);

// 
app.get("/dasboard", async (req, res)=>{
	await getUsers();
	res.send(`<h1>ok</h1>`);
});

// up server listening on specified port
app.listen(PORT, () =>
	console.log(`Example app listening on port ${PORT}!`),
);
