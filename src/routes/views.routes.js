import express from "express";
// db call fot test
import { getUsers } from '../DB/db.js';


const router = express.Router()

router.get("/dashboard", async (req, res) => {
    const users = await getUsers();
    res.status(200).send(JSON.stringify(users))
});

export default router;