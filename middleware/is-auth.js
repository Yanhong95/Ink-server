
require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  let token; 
  if(req.query.auth){
    token = req.query.auth
  } else if(req.body.token) {
    token = req.body.token
  } else if(req.headers['authorization']){
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    token = bearer[1];
  } else {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    next(error);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.WEB_TOKEN_PRIVATE_KEY.replace(/\\n/gm, '\n'));
  } catch (err) {
    const error = new Error('Invalid Token, Please login first.');
    error.statusCode = 401;
    next(error);
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    next(error);
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
