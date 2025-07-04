const supabase = require('../supabaseClient');

// ✅ Submit Proposal
// POST /api/applications
exports.submitProposal = async (req, res) => {
  const companyId = req.user.id; // from JWT
  const { tenderId, content } = req.body;

  const { data, error } = await supabase
    .from('applications')
    .insert([{ tender_id: tenderId, company_id: companyId, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// ✅ Get All Proposals for a Tender
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

// ✅ Get All Proposals by Company (My Applications)
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
