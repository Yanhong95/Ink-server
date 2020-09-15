const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoute');
const app = express();

const result = require('dotenv').config()
 
if (result.error) {
  throw result.error
}

// parse application/x-www-form-urlencoded <from></from> 针对form传输
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json 针对json传输
app.use(bodyParser.json())

app.use((req, res, next) => {
  // 所有的domain都可以access这个server
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 哪些method可以被接受
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  // client可以设置哪些header
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoute);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data
  })
});

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nodejsplayground-kxxqg.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    //console.log(process.env),
    app.listen(process.env.PORT || 8080)
  ).catch(err => console.log(err));