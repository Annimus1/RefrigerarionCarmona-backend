import 'dotenv/config'
import express from "express";
// routes
import publicRoutes from "./src/routes/public.routes.js";
import views from './src/routes/views.routes.js';
import admin from "./src/routes/admin.router.js";
import users from "./src/routes/user.routes.js";
import password from "./src/routes/recoverPassword.router.js";
// middleware 
import authMiddleware from './src/auth/authMiddleware.js';
// Whatsapp 
// import { client } from './src/bot/bot.js';

const PORT = process.env.PORT || 3000;
const app = express();

// remove x-powered-by
app.disable('x-powered-by');

// json middleware
app.use(express.json());

// auth middleware
app.use(authMiddleware);

// public endpoints
app.use("/auth", publicRoutes);

// private endpoints
app.use(views);
app.use(admin);
app.use(users);
app.use(password);

// up server listening on specified port
app.listen(PORT, () =>
	console.log(`Example app listening on port ${PORT}!`),
);
