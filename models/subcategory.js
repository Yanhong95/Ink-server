const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  notes:[
    {
      type: Schema.Types.ObjectId,
      ref: 'note'
    }
  ]
});

module.exports = mongoose.model('Subcategory', subcategorySchema);


