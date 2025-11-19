'use client';

import { useSession, signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session?.user?.name || 'Admin'}!</p>
      <p>You are logged in.</p>
      
      <button onClick={() => signOut({ callbackUrl: '/' })}>
        Sign Out
      </button>
    </div>
  );
}