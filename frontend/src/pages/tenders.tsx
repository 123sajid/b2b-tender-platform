import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Tenders() {
  const [tenders, setTenders] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
    companyId: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [companyId, setCompanyId] = useState('');

  const navigate = useNavigate();
  const limit = 5; // Tenders per page

  // ✅ Fetch tenders with auth
  const fetchTenders = async () => {
    const params: any = { page, limit };
    if (companyId) params.companyId = companyId;

    try {
      const res = await axios.get('http://localhost:5000/api/tenders', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTenders(res.data.tenders);
      setTotal(res.data.total);
    } catch (err) {
      alert('Failed to fetch tenders');
    }
  };

  // ✅ Check login before loading
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTenders();
    }
  }, [page, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tenders', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setForm({ title: '', description: '', deadline: '', budget: '', companyId: '' });
      fetchTenders();
    } catch (err) {
      alert('Failed to create tender');
    }
  };

  return (
    <div>
      {/* ✅ Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      >
        🚪 Logout
      </button>

      <h2>Tender Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.deadline}
          onChange={e => setForm({ ...form, deadline: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Budget"
          value={form.budget}
          onChange={e => setForm({ ...form, budget: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company ID"
          value={form.companyId}
          onChange={e => setForm({ ...form, companyId: e.target.value })}
          required
        />
        <button type="submit">Create Tender</button>
      </form>

      <br />

      <input
        type="text"
        placeholder="Filter by Company ID"
        value={companyId}
        onChange={e => {
          setCompanyId(e.target.value);
          setPage(1); // Reset page when filtering
        }}
      />

      <h3>All Tenders</h3>
      <ul>
        {tenders.map((t: any) => (
          <li key={t.id}>
            <strong>{t.title}</strong> – ₹{t.budget} – {t.deadline}
            <br />
            {t.description}
            <br />
            Company ID: {t.companyId}
            <br />

            {/* Edit Button */}
            <button
              onClick={async () => {
                const title = prompt('New title', t.title);
                const description = prompt('New description', t.description);
                const deadline = prompt('New deadline', t.deadline);
                const budget = prompt('New budget', t.budget);

                await axios.put(
                  `http://localhost:5000/api/tenders/${t.id}`,
                  { title, description, deadline, budget },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  }
                );
                fetchTenders();
              }}
            >
              ✏️ Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={async () => {
                if (confirm(`Delete tender "${t.title}"?`)) {
                  await axios.delete(`http://localhost:5000/api/tenders/${t.id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  });
                  fetchTenders();
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

      {/* Pagination */}
      <div>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          ◀ Prev
        </button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>
          Next ▶
        </button>
      </div>
    </div>
  );
}
