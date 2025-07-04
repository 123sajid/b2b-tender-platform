import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', industry: '', description: '', logo: null });

  const fetchCompanies = async () => {
    const res = await axios.get('http://localhost:5000/api/company');
    setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('industry', form.industry);
    formData.append('description', form.description);
    if (form.logo) formData.append('logo', form.logo);

    await axios.post('http://localhost:5000/api/company', formData);
    setForm({ name: '', industry: '', description: '', logo: null });
    fetchCompanies();
  };

  return (
    <div>
      <h2>Company Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Industry"
          value={form.industry}
          onChange={e => setForm({ ...form, industry: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <input type="file" onChange={e => setForm({ ...form, logo: e.target.files?.[0] || null })} />
        <button type="submit">Create Company</button>
      </form>

      <h3>All Companies</h3>
      <ul>
  {companies.map((c: any) => (
    <li key={c.id}>
      <strong>{c.name}</strong> – {c.industry}
      <br />
      {c.logo && <img src={c.logo} alt="logo" width={80} />}

      {/* Inline edit form */}
      <form
        onSubmit={async e => {
          e.preventDefault();
          const name = prompt('New name', c.name);
          const industry = prompt('New industry', c.industry);
          const description = prompt('New description', c.description);

          await axios.put(`http://localhost:5000/api/company/${c.id}`, {
            name,
            industry,
            description,
          });
          fetchCompanies();
        }}
      >
        <button type="submit">✏️ Edit</button>
      </form>

      {/* Delete button */}
      <button
        onClick={async () => {
          if (confirm(`Delete ${c.name}?`)) {
            await axios.delete(`http://localhost:5000/api/company/${c.id}`);
            fetchCompanies();
          }
        }}
      >
        🗑️ Delete
      </button>

      <hr />
    </li>
  ))}
</ul>
</div>
  );
}
