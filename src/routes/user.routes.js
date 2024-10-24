import express from "express";


const router = express.Router();

// GUARRANTY
// create a claim guarranty 
router.post("/guarranty", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});



export default router;