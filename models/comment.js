const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'comment'
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  likes: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Note', noteSchema);
