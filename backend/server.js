require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./src/config/db');

const rfpRoutes = require('./src/routes/rfpRoutes');
const vendorRoutes = require('./src/routes/vendorRoutes');
const proposalRoutes = require('./src/routes/proposalRoutes');

const inboundEmailWatcher = require('./src/services/inboundEmailWatcher');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/proposals', proposalRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI RFP backend running' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  if (
    process.env.IMAP_HOST &&
    process.env.IMAP_USER &&
    process.env.IMAP_PASS
  ) {
    try {
      inboundEmailWatcher.start();
      console.log("Inbound email watcher started");
    } catch (err) {
      console.warn("Inbound email watcher error:", err.message);
    }
  } else {
    console.log("Inbound email watcher disabled (IMAP not configured)");
  }
});
