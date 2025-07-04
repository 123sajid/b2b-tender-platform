const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const companies = require('../models/companies.json');
const supabase = require('../supabase');

const filePath = 'backend/models/companies.json';

const saveCompanies = data => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

exports.getAll = (req, res) => res.json(companies);

exports.getById = (req, res) => {
  const company = companies.find(c => c.id === req.params.id);
  if (!company) return res.status(404).json({ message: 'Not found' });
  res.json(company);
};

exports.create = async (req, res) => {
  const { name, industry, description } = req.body;
  const file = req.file;

  let imageUrl = '';
  if (file) {
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(`${uuidv4()}-${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) return res.status(500).json({ message: 'Upload failed', error });

    const { data: publicURLData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(data.path);

    imageUrl = publicURLData.publicUrl;
  }

  const newCompany = {
    id: uuidv4(),
    name,
    industry,
    description,
    logo: imageUrl,
  };

  companies.push(newCompany);
  saveCompanies(companies);
  res.status(201).json(newCompany);
};

exports.update = (req, res) => {
  const idx = companies.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const { name, industry, description } = req.body;
  companies[idx] = {
    ...companies[idx],
    name: name || companies[idx].name,
    industry: industry || companies[idx].industry,
    description: description || companies[idx].description,
  };

  saveCompanies(companies);
  res.json(companies[idx]);
};

exports.remove = (req, res) => {
  const idx = companies.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const deleted = companies.splice(idx, 1);
  saveCompanies(companies);
  res.json({ message: 'Deleted', deleted });
};
