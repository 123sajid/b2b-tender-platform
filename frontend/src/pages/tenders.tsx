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
  const [proposals, setProposals] = useState<{ [key: string]: any[] }>({});

  const navigate = useNavigate();
  const limit = 5;

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

  const submitProposal = async (tenderId: string) => {
    const content = prompt('Enter your proposal content:');
    if (!content) return;

    try {
      await axios.post(
        'http://localhost:5000/api/applications',
        {
          tenderId,
          companyId: form.companyId || 'test-company-id',
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('✅ Proposal submitted!');
    } catch {
      alert('❌ Failed to submit proposal');
    }
  };

  const fetchProposals = async (tenderId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/${tenderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProposals(prev => ({ ...prev, [tenderId]: res.data }));
    } catch {
      alert('Failed to load proposals');
    }
  };

  return (
    <div>
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
          setPage(1);
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

            <div>
              {/* 🔘 Submit proposal */}
              <button onClick={() => submitProposal(t.id)}>📩 Submit Proposal</button>

              {/* 📖 View proposals */}
              <button onClick={() => fetchProposals(t.id)} style={{ marginLeft: '10px' }}>
                📄 View Proposals
              </button>

              {/* Show proposals */}
              {proposals[t.id] && (
                <ul>
                  {proposals[t.id].map((p, idx) => (
                    <li key={idx}>
                      <em>{p.companyId}</em>: {p.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
