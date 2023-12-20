const mongoose = require('mongoose');

const attendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    subject: {
        type: String,
        required: true
    },
    classes: {
        type: Number,
        default: 0,
        required: true
    },
    present: {
        type: Number,
        default: 0,
        required: true
    },
    percent: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model("attendance", attendSchema);