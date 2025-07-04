require('dotenv').config();
console.log("🔍 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔍 SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);


const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const tenderRoutes = require('./routes/tender');
const authMiddleware = require('./middleware/authMiddleware');
const applicationRoutes = require('./routes/application');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route for health check
app.get('/', (req, res) => {
  res.send('🚀 B2B Tender Backend is running!');
});

// ✅ Public Routes
app.use('/api/auth', authRoutes);

// ✅ Protected Routes (Require JWT)
app.use('/api/company', authMiddleware, companyRoutes);
app.use('/api/tenders', authMiddleware, tenderRoutes);
app.use('/api/applications', applicationRoutes);
// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
