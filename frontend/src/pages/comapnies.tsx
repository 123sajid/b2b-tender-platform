import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    description: '',
    logo: null as File | null,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // ✅ Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/company', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCompanies(res.data);
    } catch {
      alert('Failed to fetch companies');
    }
  };

  // ✅ Search companies
  const handleSearch = async () => {
    if (!searchTerm.trim()) return fetchCompanies();

    try {
      const res = await axios.get(
        `http://localhost:5000/api/company/search?query=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCompanies(res.data);
    } catch {
      alert('Search failed');
    }
  };

  // ✅ Protect route
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchCompanies();
    }
  }, []);

  // ✅ Create company
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('industry', form.industry);
    formData.append('description', form.description);
    if (form.logo) formData.append('logo', form.logo);

    try {
      await axios.post('http://localhost:5000/api/company', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setForm({ name: '', industry: '', description: '', logo: null });
      fetchCompanies();
    } catch {
      alert('Failed to create company');
    }
  };

  return (
    <div>
      {/* ✅ Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
        style={{ float: 'right' }}
      >
        🚪 Logout
      </button>

      <h2>Company Management</h2>

      {/* ✅ Search */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search companies by name or industry"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSearch}>🔍 Search</button>
      </div>

      {/* ✅ Create Form */}
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
        <input
          type="file"
          onChange={e =>
            setForm({ ...form, logo: e.target.files?.[0] || null })
          }
        />
        <button type="submit">Create Company</button>
      </form>

      {/* ✅ Company List */}
      <h3>All Companies</h3>
      <ul>
        {companies.map((c: any) => (
          <li key={c.id}>
            <strong>{c.name}</strong> – {c.industry}
            <br />
            {c.logo && <img src={c.logo} alt="logo" width={80} />}
            <br />

            {/* Edit */}
            <button
              onClick={async () => {
                const name = prompt('New name', c.name);
                const industry = prompt('New industry', c.industry);
                const description = prompt('New description', c.description);

                await axios.put(
                  `http://localhost:5000/api/company/${c.id}`,
                  { name, industry, description },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  }
                );
                fetchCompanies();
              }}
            >
              ✏️ Edit
            </button>

            {/* Delete */}
            <button
              onClick={async () => {
                if (confirm(`Delete ${c.name}?`)) {
                  await axios.delete(
                    `http://localhost:5000/api/company/${c.id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                    }
                  );
                  fetchCompanies();
                }
              }}
              style={{ marginLeft: '10px', color: 'red' }}
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
