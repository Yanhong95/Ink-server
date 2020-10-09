const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

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
}, { collation: { locale: 'en_US', numericOrdering:true} });

noteSchema.pre('remove', function(next) {
  // Remove all the comments that refers
  // console.log("Hello middleware");
  Comment.remove({ note: this._id }).exec();
  next;
});

module.exports = mongoose.model('Note', noteSchema);
