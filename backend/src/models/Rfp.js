const mongoose = require("mongoose");

const RfpSchema = new mongoose.Schema({
  title: String,
  description: String,

  parsed: {
    type: Object,
    default: {}
  },

  vendorsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],

}, { timestamps: true });

module.exports = mongoose.model("Rfp", RfpSchema);
