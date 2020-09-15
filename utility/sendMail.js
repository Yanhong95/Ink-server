const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendMail = (to, from, subject, html) => {

  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: html,
  }

  console.log(msg);
  sgMail.send(msg);
};



