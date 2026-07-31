const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    goal: {
        type: Number,
        required: true
    },

    collected: {
        type: Number,
        default: 0
    },

    description: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Campaign", campaignSchema);