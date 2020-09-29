
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoute');
const noteRoute = require('./routes/noteRoute');
const S3Route = require('./routes/S3Route');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan')
const app = express();
const result = require('dotenv').config({silent: true})
 
if (result.error) {
  throw result.error
}

// parse application/x-www-form-urlencoded <from></from> 针对form传输
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json 针对json传输
app.use(bodyParser.json())

app.use((req, res, next) => {
  // 所有的domain都可以access这个server  跨域资源共享（ CORS ）
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 哪些method可以被接受
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  // client可以设置哪些header
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.get('/', (req,res)=> res.send('Hi there!'));
app.use('/auth', authRoute);
app.use('/note', noteRoute);
app.use('/s3', S3Route)
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

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

// console.log(process.env);

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nodejsplayground-kxxqg.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    console.log("Ink server started!"),
    app.listen(process.env.PORT || 8080)
  ).catch(err => console.log(err));