const aiService = require("../services/aiService");
const Rfp = require("../models/Rfp");
const Vendor = require("../models/Vendor");
const sendEmail = require("../services/emailService");

exports.createRfp = async (req, res) => {
  try {
    let { title, description, text } = req.body;
    let rfpData = {};

    if (text) {
      const parsed = await aiService.parseRfpFromText(text);

      rfpData = {
        title: parsed.title || title || "Untitled RFP",
        description: text,
        parsed
      };
    }
    
    else if (title && description) {
      const parsed = await aiService.parseRfpFromText(description);

      rfpData = {
        title,
        description,
        parsed
      };
    } else {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const rfp = new Rfp(rfpData);
    await rfp.save();

    res.json(rfp);
  } catch (err) {
    console.error("RFP create error:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllRfps = async (req, res) => {
  try {
    const rfps = await Rfp.find().sort({ createdAt: -1 });
    res.json(rfps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRfpById = async (req, res) => {
  try {
    const rfp = await Rfp.findById(req.params.id);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    res.json(rfp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendRfpToVendors = async (req, res) => {
  try {
    const rfp = await Rfp.findById(req.params.id);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const vendors = await Vendor.find();

    const results = [];

    for (const vendor of vendors) {
      const emailBody = `
        Hi ${vendor.name},

        You have received a new RFP:
        Title: ${rfp.title}
        Description: ${rfp.description}

        Please reply to this email with your proposal.
      `;

      const result = await sendEmail({
        to: vendor.email,
        subject: `New RFP: ${rfp.title}`,
        text: emailBody,
      });

      results.push({
        vendor: vendor._id,
        result,
      });
    }

    res.json({ message: "Sent", results });
  } catch (err) {
    console.error("sendRfpToVendors error:", err);
    res.status(500).json({ error: err.message });
  }
};
