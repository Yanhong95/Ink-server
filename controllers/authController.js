require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utility/sendMail');
const { validationResult } = require('express-validator');
const User = require('../models/user');


exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors.errors);
      const error = new Error(`${errors.array()[0].param}:  ${errors.array()[0].msg}`);
      error.message = errors.errors[0].msg;
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const hashedPW = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPW,
      firstName: firstName,
      lastName: lastName,
      emailVerified: false,
    });
    user.role.push('user');
    const result = await user.save();
    const hashedEmailVerificationCode = jwt.sign(
      { email: email, userId: result._id}, 
      process.env.EMAIL_VERIFICATION_PRIVATE_KEY.replace(/\\n/gm, '\n'));
    console.log(hashedEmailVerificationCode);
    user.emailVerificationCode = hashedEmailVerificationCode;
    await user.save();
    const verifyEmailLink = `${process.env.CLIENTSITE_URL}/verityEmail/${hashedEmailVerificationCode}`
    sendMail(
       email,
      'yanhongmain@gmail.com',
      'Activate your email for INK!',
      `<h5>Hello ${firstName}, thanks for sign up on my website, please click <a href=${verifyEmailLink}>here</a> to verify your email, have a nice day :) </h5>`
    );
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      if (!user.emailVerified) {
        //...todo
        // send verify link
        const error = new Error('Your email address is not verified, we just sent a link to your email, please click on the link to verify.');
        error.statusCode = 401;
        throw error;
      } else {
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString()
          },
          process.env.WEB_TOKEN_PRIVATE_KEY.replace(/\\n/gm, '\n'),
          { expiresIn: '1h' }
        );
        res.status(200).json({ idToken: token, userId: loadedUser._id.toString(), expiresIn: 1 * 60 * 60 });
      }
    } else {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    };
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.verityEmail = async (req, res, next) => {
  try {
    const hashedEmailVerificationCode = req.body.emailVerificationCode;
    let decodedVerifycationCode;
    try {
      // decodedToken = jwt.verify(token, process.env.WEB_TOKEN_PRIVATE_KEY.replace(/\\n/gm, '\n'));
      decodedVerifycationCode = jwt.verify(hashedEmailVerificationCode, process.env.EMAIL_VERIFICATION_PRIVATE_KEY.replace(/\\n/gm, '\n'));
    } catch (err) {
      const error = new Error('invalid verifycation code.');
      error.statusCode = 500;
      throw error;
    }
    if (!decodedVerifycationCode) {
      res.status(401).json({ message: "invalid verifycation code."} );
    }else{
      // console.log(decodedVerifycationCode);
      const userId = decodedVerifycationCode.userId;
      const email = decodedVerifycationCode.email;
      const user = await User.findById(userId);
      if(user && user.email === email){
        if(!user.emailVerified){
          user.emailVerified = true;
          await user.save();
        }
        res.status(200).json({ userId: user._id.toString()} );
      }else{
        res.status(401).json({ message: "invalid verifycation code."} );
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
