const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Label', labelSchema);