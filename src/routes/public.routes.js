import express from 'express';

const app = express();
const router = express.Router();

router.post("/auth/login", (req, res)=>{
	res.status(501);
	res.send("Not Implemented");
});

router.post("/auth/logout", (req, res)=>{
	res.status(501);
	res.send("Not Implemented");
});

router.post("/auth/register", (req, res)=>{
	res.status(501);
	res.send("Not Implemented");
});

router.post("auth/contact", (req, res)=>{
	console.log("body: ",req.body)
	res.send("OK")
});

export default router;

