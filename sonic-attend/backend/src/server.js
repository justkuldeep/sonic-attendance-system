const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Health Check
app.get('/', (req, res) => {
  res.send('Antigravity Backend is Active');
});

app.listen(PORT, () => {
  console.log(`Antigravity Server running on port ${PORT}`);
});
