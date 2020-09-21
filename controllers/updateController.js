
const Subcategory = require('../models/subcategory');
const Note = require('../models/note');
const Topic = require('../models/topic');

exports.loadCatalog = async (req, res, next) => {
  try {
    const result = await Topic.find()
      .populate({
        path: 'subcategories', model: 'Subcategory',
        select: 'name',
        populate: {
          path: 'notes', model: 'Note',
          select: 'name'
        }
      });
      console.log(result);
    res.status(200).json({ message: 'catalogFound', catalog: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

// const error = new Error('A user with this email could not be found.');
// error.statusCode = 401;
// throw error;