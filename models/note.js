const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true  
  },
  comments:[
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ]
});

module.exports = mongoose.model('Note', noteSchema);
