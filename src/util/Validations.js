import { verifyToken } from '../auth/auth.js';

export function validateToken(token, next, res) {
  const validToken = verifyToken(token.split(" ")[1]);
  // console.log(validToken);
  switch (validToken) {
    case "valid":
      return next();
    case "expired":
      res.status(301).send(`<h1>Redirect to loging</h1>`);
      break;
    case "invalid":
      res.status(401).send(`<h1>Unauthorized ${req.url}</h1>`);
      break;
  }
}