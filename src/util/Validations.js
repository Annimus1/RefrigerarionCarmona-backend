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

export function validateCategory(category) {
  if (category === "mantenimiento" || category === "instalacion" || category === "reparacion") {
    return true;
  }
  else {
    return false;
  }
}

export function jobDiff(userJob, dbJob) {
  // return a new object based on the existing one (dbJob) with the changes you want to make (userJob)
  
  const result = {}

  // get keys from object
  const dbKeys = Object.keys(dbJob);

  
  dbKeys.forEach(key => {
    if (userJob[key]) {
      dbJob[key] == userJob[key] ? result[key]=dbJob[key] : result[key]=userJob[key];
    }else{
      result[key] = dbJob[key];
    }
  })

  return result;
}