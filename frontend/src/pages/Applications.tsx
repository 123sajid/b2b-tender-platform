import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setApplications(res.data);
    } catch {
      alert('Failed to fetch applications');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchMyApplications();
    }
  }, []);

  return (
    <div>
      <h2>📄 My Applications</h2>
      <ul>
        {applications.map((app: any) => (
          <li key={app.id}>
            <strong>{app.tenders?.title}</strong><br />
            <em>Deadline:</em> {app.tenders?.deadline}<br />
            <p>{app.content}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
