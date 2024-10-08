import { validateToken } from "../util/Validations.js";


export default function authMiddleware(req, res, next){

	if (req.url.startsWith("/auth/")) {
		console.log("public endpoint: ", req.url)
		next();
	}

	else {
		console.log("private endpoint: ", req.url)
		const auth = req.get("Authorization") || null;

		if (auth) {
			validateToken(auth, next, res);
		} else {
			res.status(401).send(`<h1>Unauthorized -> Authorization needed.</h1>`);
		}
	}
}