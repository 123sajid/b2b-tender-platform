const supabase = require('../supabaseClient.js');


// ✅ Create Tender
// POST /api/tenders
exports.createTender = async (req, res) => {
  const companyId = req.user.id; // from JWT
  const { title, description, deadline, budget } = req.body;

  const { data, error } = await supabase
    .from('tenders')
    .insert([{ title, description, deadline, budget, company_id: companyId }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// ✅ Get All Tenders (with pagination)
// GET /api/tenders?page=1&limit=10
exports.getAllTenders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('tenders')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ tenders: data, total: count });
};

// ✅ Get Tenders by Company
// GET /api/tenders/company/:companyId
exports.getTendersByCompany = async (req, res) => {
  const { companyId } = req.params;

  const { data, error } = await supabase
    .from('tenders')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// ✅ Delete Tender
// DELETE /api/tenders/:id
exports.deleteTender = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('tenders').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
};

// ✅ Update Tender
// PUT /api/tenders/:id
exports.updateTender = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, budget } = req.body;

  const { data, error } = await supabase
    .from('tenders')
    .update({ title, description, deadline, budget })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};
