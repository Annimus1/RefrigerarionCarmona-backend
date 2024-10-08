import express from "express";

const router = express.Router();

// change password
router.post("/changePassword", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

// forgot password
router.post("/forgotPassword", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});

export default router;