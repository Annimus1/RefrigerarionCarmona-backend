import express from "express";

const router = express.Router();


// create a new job query
router.post("/job", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

// create a claim guarranty 
router.post("/guarranty", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});



export default router;