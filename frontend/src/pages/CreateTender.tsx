import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTender() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tenders', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Tender created!');
      navigate('/tenders');
    } catch {
      alert('Failed to create tender');
    }
  };

  return (
    <div>
      <h2>📦 Create Tender</h2>
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
        <button type="submit">Publish Tender</button>
      </form>
    </div>
  );
}
