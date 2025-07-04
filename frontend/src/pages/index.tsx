// src/pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login or dashboard
    router.push('/login'); // Or '/dashboard' if already logged in
  }, []);

  return <p>Redirecting...</p>;
}
