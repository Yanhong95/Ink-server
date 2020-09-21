const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subcategories:[
    {
      type: Schema.Types.ObjectId,
      ref: 'subcategory'
    }
  ]
});

module.exports = mongoose.model('Topic', topicSchema);

