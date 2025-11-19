'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

interface Page {
    id: string;
    title: string;
    slug: string;
}

export default function ManagePages() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPages() {
            try {
                const res = await fetch('/api/pages');
                if (!res.ok) {
                    throw new Error('Failed to fetch pages');
                }

                const data = await res.json();
                setPages(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchPages();
    }, []);

    if (loading) return <p>Loading pages...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
    <div>
      <h1>Manage Pages</h1>
      {/* We will add a "Create New Page" button here later */}
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Slug</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{page.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>/{page.slug}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {/* This link will eventually go to the page editor */}
                <Link href={`/admin/pages/edit/${page.slug}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}