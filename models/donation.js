const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign"
    },

    amount: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);