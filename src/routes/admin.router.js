import express from "express";

const router = express.Router();


// create a new user (admin)


// create a new job
router.post("/job", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

// edit a job
router.put("/job/:id", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

// create a claim guarrantys
router.put("/guarranty/:id", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});


export default router;