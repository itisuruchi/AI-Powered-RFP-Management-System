
const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailController");

router.post("/:id/send", sendEmail);

module.exports = router;
