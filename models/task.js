const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: String,
    description: String,
    projectId: String,
    status: Boolean,
    labels: Array
});

module.exports = mongoose.model('Task', taskSchema);