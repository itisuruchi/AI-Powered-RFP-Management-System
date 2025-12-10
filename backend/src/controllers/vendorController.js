const Vendor = require('../models/Vendor');

exports.createVendor = async (req, res) => {
  try {
    console.log("Body received:", req.body);  
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listVendors = async (req, res) => {
  try {
    const list = await Vendor.find().limit(200);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVendor = async (req, res) => {
  try {
    const v = await Vendor.findById(req.params.id);
    if (!v) return res.status(404).json({ error: 'Vendor not found' });
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
