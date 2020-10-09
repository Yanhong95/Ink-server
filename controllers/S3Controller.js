const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const Note = require('../models/note');
const SubCategory = require('../models/subcategory');
const contentDisposition = require('content-disposition');
const result = require('dotenv').config({silent: true})
const { dotenvError } = require('../utility/dotenvError');
dotenvError(result);

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.getS3SignedUrl = (req, res, next) => {
  try {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const params = {
      Bucket: req.query.uploadS3Bucket,
      Key: `${req.query.uploadPath.replace(/\s+/g, '%')}/${req.userId}-${req.query.filename}`,
      ContentType: req.query.type
    };
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        console.log('error', err);
      } else {
        return res.status(200).json({ signedUrl: url, fileName: `${req.userId}-${req.query.filename}` });
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const sleep = ( millisecond, func) => {
  return new Promise(resolve => {
    setTimeout(() => {
        func
    }, millisecond)
})}

exports.getS3Note = async (req, res, next) => {
  // if (!req.isAuth) {
  //   const error = new Error('Not authenticated!');
  //   error.code = 401;
  //   throw error;
  // }
  try {
    const note = await Note.findById(req.body.noteId);
    if (!note) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    const URL = note.url;
    const Name = note.name;
    const params = {
      Bucket: "myink",
      Key: note.url.split("myink/")[1].replace(/\s+/g, '%')
      // notes/algorithm/Array/5f6961668bfd50a1780a66eb-18.%4Sum.md
    };
    data = await s3.getObject(params).promise();
    let tempPath = path.join(__dirname, '../download', note.name.replace(/\s+/g, '%').toLowerCase());
    fs.writeFileSync(tempPath, data.Body);
    res.setHeader('Content-Length', data.ContentLength);
    res.setHeader('Content-Type', mime.contentType(note.name));
    const realName = encodeURI(note.name.replace(/\s+/g, '%').toLowerCase(), "GBK").toString('iso8859-1');
    res.setHeader('Content-Disposition', 'attachment; filename="' + realName + '"');
    var filestream = fs.createReadStream(tempPath);
    filestream.pipe(res);
    filestream.on('error', (err) => {
      console.log('Error in read stream...' + err);
    });
    res.on('error', (err) => {
      console.log('Error in write stream...' + err);
    })
    const func = fs.unlinkSync(tempPath);
    await sleep(300, func);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getS3Resume = async (req, res, next) => {
  try {
    const params = {
      Bucket: "myink",
      Key: 'users/main/Resume_Full_Stack.pdf'
    };
    data = await s3.getObject(params).promise();
    let tempPath = path.join(__dirname, '../download', 'Resume_Full_Stack.pdf');
    fs.writeFileSync(tempPath, data.Body);
    res.setHeader('Content-Length', data.ContentLength);
    res.setHeader('Content-Type', mime.contentType('Resume_Full_Stack.pdf'));
    res.setHeader('Content-Disposition', 'attachment; filename="Resume_Full_Stack.pdf"');
    var filestream = fs.createReadStream(tempPath);
    filestream.pipe(res);
    filestream.on('error', (err) => {
      console.log('Error in read stream...' + err);
    });
    res.on('error', (err) => {
      console.log('Error in write stream...' + err);
    })
    const func = fs.unlinkSync(tempPath);
    await sleep(3000, func);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteNote = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    console.log(req.body, req.query);
    const categoryId = req.query.categoryId;
    const noteId = req.query.noteId;
    const subCategory = await SubCategory.findById(categoryId);
    if (!subCategory) {
      const error = new Error('No subCategory found!');
      error.code = 404;
      throw error;
    }
    const newNoteList = subCategory.notes.filter( note_id => note_id != noteId);
    console.log(subCategory.notes);
    console.log(newNoteList);
    subCategory.notes = newNoteList;
    await subCategory.save();
    const note = await Note.findOne({_id: noteId});
    await Note.findByIdAndDelete({ _id: noteId}, function(err, note) { note.remove()})
    const noteUrl = note.url;
    const noteKey = noteUrl.split("myink/").pop();
    const params = {
      Bucket: "myink", 
      Key: noteKey
     };
    s3.deleteObject(params, (err, data) => {
       if (err) {
        console.log(err, err.stack);
       } else {
        return res.status(200).json({ message : 'deletion successful!'}); // successful response
       }     
     });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}