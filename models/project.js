const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }]
});

module.exports = mongoose.model('Project', projectSchema);