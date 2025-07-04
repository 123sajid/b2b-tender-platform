const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filePath = 'backend/models/tenders.json';

let tenders = require('../models/tenders.json');

const saveTenders = data => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET /api/tenders?page=1&limit=5&companyId=xyz
exports.getAll = (req, res) => {
  let results = [...tenders];

  const { page = 1, limit = 10, companyId } = req.query;

  if (companyId) {
    results = results.filter(t => t.companyId === companyId);
  }

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + Number(limit));

  res.json({
    page: Number(page),
    limit: Number(limit),
    total: results.length,
    tenders: paginated,
  });
};

// GET /api/tenders/:id
exports.getById = (req, res) => {
  const tender = tenders.find(t => t.id === req.params.id);
  if (!tender) return res.status(404).json({ message: 'Tender not found' });
  res.json(tender);
};

// POST /api/tenders
exports.create = (req, res) => {
  const { title, description, deadline, budget, companyId } = req.body;

  const newTender = {
    id: uuidv4(),
    title,
    description,
    deadline,
    budget,
    companyId,
  };

  tenders.push(newTender);
  saveTenders(tenders);
  res.status(201).json(newTender);
};

// PUT /api/tenders/:id
exports.update = (req, res) => {
  const index = tenders.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Tender not found' });

  const { title, description, deadline, budget } = req.body;
  tenders[index] = {
    ...tenders[index],
    title: title ?? tenders[index].title,
    description: description ?? tenders[index].description,
    deadline: deadline ?? tenders[index].deadline,
    budget: budget ?? tenders[index].budget,
  };

  saveTenders(tenders);
  res.json(tenders[index]);
};

// DELETE /api/tenders/:id
exports.remove = (req, res) => {
  const index = tenders.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Tender not found' });

  const deleted = tenders.splice(index, 1);
  saveTenders(tenders);
  res.json({ message: 'Deleted', deleted });
};
