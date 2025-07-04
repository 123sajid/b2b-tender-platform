const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Use memory storage

const supabase = require('../supabase'); // ✅ Required for search
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/companyController');

// 🔍 Search companies by name or industry
// ✅ Place BEFORE /:id route to prevent conflict
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: 'Query required' });

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${query}%`)
    .or(`industry.ilike.%${query}%`);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 📦 Standard CRUD routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', upload.single('logo'), create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
