const supabase = require('../supabaseClient');

// ✅ Submit a new proposal by a logged-in company
// POST /api/applications
exports.submitProposal = async (req, res) => {
  const companyId = req.user.id; // Extracted from JWT
  const { tenderId, content } = req.body;

  const { data, error } = await supabase
    .from('applications')
    .insert([{ tender_id: tenderId, company_id: companyId, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// ✅ Get all proposals submitted for a specific tender
// GET /api/applications/:tenderId
exports.getApplicationsByTender = async (req, res) => {
  const { tenderId } = req.params;

  const { data, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('tender_id', tenderId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// ✅ Get all proposals submitted by a specific company (by companyId param)
// GET /api/applications/company/:companyId
exports.getApplicationsByCompany = async (req, res) => {
  const { companyId } = req.params;

  const { data, error } = await supabase
    .from('applications')
    .select('*, tenders(title, deadline)')
    .eq('company_id', companyId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// ✅ Get all proposals submitted by the logged-in company
// GET /api/applications/my
exports.getApplicationsByLoggedInCompany = async (req, res) => {
  const companyId = req.user.id;

  const { data, error } = await supabase
    .from('applications')
    .select('*, tenders(title, deadline)')
    .eq('company_id', companyId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
