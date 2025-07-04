const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');

const app = express();
const PORT = 5000;

// ✅ Middleware first
app.use(cors());
app.use(express.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 B2B Tender Backend is running!');
});

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ Company routes
app.use('/api/company', companyRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
