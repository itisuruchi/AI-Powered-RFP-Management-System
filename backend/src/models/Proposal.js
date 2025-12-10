const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  rfp: { type: mongoose.Schema.Types.ObjectId, ref: 'Rfp', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

  rawEmail: { type: Object },       
  parsed: { type: Object },         

  score: Number,                    
  analysis: String,                

  createdAt: { type: Date, default: Date.now },
  attachments: [{ filename: String, url: String }]
});

module.exports = mongoose.model('Proposal', ProposalSchema);
