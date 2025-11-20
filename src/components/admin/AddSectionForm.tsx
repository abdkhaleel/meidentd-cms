// src/components/admin/AddSectionForm.tsx

'use client';

import { useState } from 'react';

interface AddSectionFormProps {
  pageId: string;
  onSectionAdded: () => void;
}

export default function AddSectionForm({ pageId, onSectionAdded }: AddSectionFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          order,
          pageId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create section');
      }

      setTitle('');
      setContent('');
      setOrder(0);
      
      onSectionAdded();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ border: '2px solid blue', padding: '1rem', marginTop: '2rem' }}>
      <h3>Add New Top-Level Section</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Content (HTML allowed)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            required
            style={{ padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
          {isSubmitting ? 'Adding...' : 'Add Section'}
        </button>
      </form>
    </div>
  );
}