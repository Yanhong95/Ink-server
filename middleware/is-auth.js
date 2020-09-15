
require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  let token; 
  if(req.query.auth){
    token = req.query.auth
  } else if(req.body.token) {
    token = req.body.token
  } else {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.WEB_TOKEN_PRIVATE_KEY.replace(/\\n/gm, '\n'));
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
