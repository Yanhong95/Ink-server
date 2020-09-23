const Subcategory = require('../models/subcategory');
const Note = require('../models/note');
const Topic = require('../models/topic');

exports.saveNote = async (req, res, next) => {
  try {
    const topic = new Topic();
    topic.name = "algorithm";
    topic.save();
    const note1 = new Note({ name: "test4", url: "fsfsgertery" });
    const note2 = new Note({ name: "test5", url: "fsfsgertery" });
    const note3 = new Note({ name: "test6", url: "fsfsgertery" });
    const result1 = await note1.save();
    const result2 = await note2.save();
    const result3 = await note3.save();
    const subcategory1 = new Subcategory({});
    subcategory1.name = "Syntax";
    subcategory1.notes.push(result1, result2, result3);
    await subcategory1.save();
    const subcategory2 = new Subcategory({});
    subcategory2.name = "BFS";
    subcategory2.notes.push(result1, result2, result3);
    await subcategory2.save();
    const subcategory3 = new Subcategory({});
    subcategory3.name = "DFS";
    subcategory3.notes.push(result1, result2, result3);
    await subcategory3.save();
    const topic3 = await Topic.findOne({ name: 'algorithm' });
    topic3.subcategories.push(subcategory1, subcategory2, subcategory3)
    await topic3.save();

    const subcategory4 = new Subcategory({});
    subcategory4.name = "ArrowFunction";
    await subcategory4.save();
    const topic2 = new Topic();
    topic2.name = "javascript";
    topic2.subcategories.push(subcategory4);
    await topic2.save();

    res.status(201).json({ message: 'created!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.loadTopic = async (req, res, next) => {
  try {
    const type = req.body.type;
    const result = await Topic.findOne({ name: type })
      .populate({
        path: 'subcategories', model: 'Subcategory',
        populate: {
          path: 'notes', model: 'Note'
        }
      });
    res.status(200).json({ message: 'topicFound!', subcategories: result.subcategories });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.loadNote = async (req, res, next) => {
  try {

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.loadCatalog = async (req, res, next) => {
  try {
    const topics = await Topic.find()
      .populate({
        path: 'subcategories', model: 'Subcategory',
        select: 'name',
        options: { sort: { 'name': 1 } },
        populate: {
          path: 'notes', model: 'Note',
          select: 'name',
          options: { sort: { 'name': 1 } },
        }
      });
    res.status(200).json({ message: 'catalogFound', catalog: topics });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.addNote = async (req, res, next) => {
  try {
    const newTopic = req.body.topic;
    const newSubcategory = req.body.subcategory;
    const newFileURL = req.body.fileURL;
    const newNoteName = req.body.noteName;

    const note = new Note();
    note.name = newNoteName.charAt(0).toUpperCase() + newNoteName.slice(1);
    note.url = newFileURL;
    await note.save();
    const theTpoic = await Topic.findOne({ name: new RegExp('^' + newTopic + '$', "i") })
    if (!theTpoic) {
      const subcategory = new Subcategory();
      subcategory.name = newSubcategory.charAt(0).toUpperCase() + newSubcategory.slice(1);;
      subcategory.notes.push(note);
      await subcategory.save();
      const topic = new Topic();
      topic.name = newTopic.toLowerCase();
      topic.subcategories.push(subcategory);
      await topic.save();
    } else {
      const theSubcategory = await Subcategory.findOne({ name: new RegExp('^' + newSubcategory + '$', "i") })
        .populate({ path: 'notes', model: 'Note', select: 'name' });
      if (!theSubcategory) {
        const subcategory = new Subcategory();
        subcategory.name = newSubcategory.charAt(0).toUpperCase() + newSubcategory.slice(1);;
        subcategory.notes.push(note);
        await subcategory.save();
        theTpoic.subcategories.push(subcategory);
        theTpoic.save();
      } else {
        // console.log(theSubcategory.notes);
        const noteNames = theSubcategory.notes.reduce((acc, cur) => acc.concat(cur.name.toLowerCase()), []);
        if (noteNames.includes(note.name.toLowerCase())) {
          const error = new Error('A note with the same name already exsited in the catagory, please choose new one.');
          error.statusCode = 409;
          throw error;
        }else{
          theSubcategory.notes.push(note);
          theSubcategory.save();
        }
      }
    }
    res.status(201).json({ message: `Note ${newNoteName} has been created!` });
    return
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

