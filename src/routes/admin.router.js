import express from "express";
import { getPayload } from "../auth/auth.js";
import { createJob, getJob, getJobById, updateJob } from "../DB/db.js";
import { jobDiff } from "../util/Validations.js";

const router = express.Router();

// TODO
// create a new user (admin)


// create a new job
router.post("/job", async (req, res) => {

	const warranty_days = 30;

	// get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);

	// get data from request
	const body = req.body;

	// object to create new job
	const jobData = {};

	// if admin
	if (payload.role === "admin") {
		jobData.owner = payload.id;
		jobData.client = body.client;
		jobData.category = body.category;
		jobData.price = body.price;
		jobData.note = body.note;
		jobData.warranty_coverage = body.warranty_coverage;
		jobData.warranty_expiration_date = new Date().getTime() + (1000 * 60 * 60 * 24 * warranty_days); // time + x days 

	}
	// if user
	else {
		jobData.client = payload.id;
		jobData.owner = null;
		jobData.category = body.category;
		jobData.price = null;
		jobData.note = null;
		jobData.warranty_coverage = null;
		jobData.warranty_expiration_date = null;
	}

	// create the new Job
	let result = await createJob(jobData);


	if (result > 0) {
		console.log(`${payload.name} ${payload.lastName} has created a new job: `, result);
		res.status(201);
		res.send(JSON.stringify({ insertId: result }));
	} else {
		res.status(400).send();
	}
});

// get jobs
router.get("/job", async (req, res) => {
	// get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);

	const jobs = await getJob(payload);

	if (jobs != null) {
		res.send(JSON.stringify(jobs));
	} else {
		res.status(400).send();
	}
});

// edit a job
router.put("/job/:id", async (req, res) => {
	// get the token and extract payload
	const token = req.get("Authorization").split(" ")[1];
	const payload = getPayload(token);

	// get the id from paramas
	const id = req.params.id;

	// get data from request
	const body = req.body;


	// Admin can modify all properties except id
	if (payload.role === "admin") {
		try {
			// get job from DB
			const dbJob = await getJobById(payload, id);
			// console.log(dbJob);

			const editedJob = jobDiff(body, dbJob);

			// get time now
			let now = new Date().getTime();
			// set warranty exp day
			let time = now + (1000 * 60 * 60 * 24 * (payload.warranty_days ? payload.warranty_days : 30));
			// create a date with format (YYYY-MM-DD)
			let dbtime = new Date(time).toISOString().split("T")[0];

			// save time inside the object
			editedJob.warranty_expiration_date = dbtime;
			// last update now 
			editedJob.update_date = new Date(now).toISOString().split("T")[0];

			// Update Job
			await updateJob(editedJob);

			res.status(201).send(JSON.stringify(editedJob));
		} catch (error) {
			res.status(500).send();
		}

	} 
	// User can't modify jobs 
	else { // user
		res.status(401).send();
	}
});

// create a claim guarrantys
router.put("/guarranty/:id", (req, res) => {
	res.status(501);
	res.send("Not Implemented");
});


export default router;