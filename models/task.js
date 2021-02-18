const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: String,
    description: String,
    projectId: Schema.Types.ObjectId,
    status: Boolean,
    labels: [{
        type: Schema.Types.ObjectId,
        ref: "Label"
      }]
});

module.exports = mongoose.model('Task', taskSchema);