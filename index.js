import express from "express";
import publicRoutes from "./src/routes/public.routes.js";

const PORT = process.env.PORT ?? 3000;
const app = express();

// json middleware
app.use(express.json());

// public endpoints
app.use(publicRoutes);

// test endpoint
app.get("/ping", (req, res)=>{
	res.send("pong");
});

// up server listening on specified port
app.listen(PORT, () =>
	console.log(`Example app listening on port ${PORT}!`),
);
