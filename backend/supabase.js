// ✅ Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// ✅ Read from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✅ Validate env variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

// ✅ Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
