const sgMail = require('@sendgrid/mail');
const result = require('dotenv').config({silent: true});
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { dotenvError } = require('./dotenvError');
dotenvError(result);


exports.sendMail = (to, from, subject, html) => {

  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: html,
  }

  console.log('sendMarl: ', msg);
  sgMail.send(msg);
};



