import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get('http://localhost:5000/api/auth/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome to your dashboard</h2>
      <p>Logged in as: {user?.email}</p>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
