const fs = require('fs');
const path = require('path');
const applicationsPath = path.join(__dirname, '../models/applications.json');

function readApplications() {
  return JSON.parse(fs.readFileSync(applicationsPath));
}

function writeApplications(data) {
  fs.writeFileSync(applicationsPath, JSON.stringify(data, null, 2));
}

// ✅ Submit Proposal
exports.submitProposal = (req, res) => {
  const { tenderId, companyId, content } = req.body;
  const applications = readApplications();

  const newApp = {
    id: Date.now().toString(),
    tenderId,
    companyId,
    content,
    submittedAt: new Date().toISOString(),
  };

  applications.push(newApp);
  writeApplications(applications);
  res.status(201).json(newApp);
};

// ✅ Get All Proposals for Tender
exports.getProposalsByTender = (req, res) => {
  const { tenderId } = req.params;
  const applications = readApplications();
  const filtered = applications.filter(app => app.tenderId === tenderId);
  res.json(filtered);
};
