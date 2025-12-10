const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');
const Rfp = require('../models/Rfp');
const aiService = require('./aiService');

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: parseInt(process.env.IMAP_PORT || '993', 10),
    tls: true,   
    authTimeout: 5000,

    tlsOptions: {
      rejectUnauthorized: false
    }
  }
};

let connection = null;

exports.start = async () => {
  if (!process.env.IMAP_USER) {
    console.log('IMAP not configured; skipping inbound watcher');
    return;
  }

  try {
    connection = await imaps.connect(config);
    console.log('IMAP connected, starting mailbox poller');
  } catch (err) {
    console.error('IMAP connection failed:', err.message);
    return;
  }

  setInterval(async () => {
    try {
      await connection.openBox('INBOX');
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = { bodies: [''] };

      const results = await connection.search(searchCriteria, fetchOptions);

      for (const res of results) {
        const raw = res.parts.find(p => p.which === '')?.body;
        if (!raw) continue;

        const parsed = await simpleParser(raw);
        const from = parsed.from?.value?.[0];
        const fromEmail = from?.address;
        const subject = parsed.subject || '';
        const text = parsed.text || parsed.html || '';

        const vendor = await Vendor.findOne({ email: fromEmail }) || null;

        let rfp = null;
        const match = subject.match(/RFP[:\s]*([0-9a-fA-F]{24})/);
        if (match) {
          rfp = await Rfp.findById(match[1]);
        }
        if (!rfp) rfp = await Rfp.findOne().sort({ createdAt: -1 });

        const parsedProposal = await aiService.parseProposalFromEmail(text);

        const proposal = new Proposal({
          rfp: rfp?._id,
          vendor: vendor?._id,
          rawEmail: { from: parsed.from, subject, date: parsed.date },
          parsed: parsedProposal
        });

        await proposal.save();

        try {
          const scoreObj = await aiService.scoreProposal({
            ...proposal.toObject(),
            rfp,
            vendor
          });

          proposal.score = scoreObj.score;
          proposal.parsed = { ...(proposal.parsed || {}), ...(scoreObj.parsed || {}) };
          await proposal.save();

        } catch (err) {
          console.warn('scoring failed:', err.message);
        }

        connection.addFlags(res.attributes.uid, '\\Seen', (err) => {
          if (err) console.warn('Failed to add Seen flag', err);
        });
      }
    } catch (err) {
      console.warn('IMAP polling error:', err.message);
    }
  }, parseInt(process.env.IMAP_POLL_INTERVAL || '30000', 10));
};
