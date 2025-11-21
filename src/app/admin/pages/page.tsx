'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Plus, Globe, Loader2, FileText } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
}

export default function ManagePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Pages
  const fetchPages = useCallback(async () => {
    // Only set full loading on first load
    if (pages.length === 0) setLoading(true);
    try {
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data = await res.json();
      setPages(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [pages.length]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // Create Page Handler
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, slug: newSlug }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create page');
      }
      
      const newPage = await res.json();
      
      // Reset and Refresh
      setNewTitle('');
      setNewSlug('');
      fetchPages();
      
      // Optional: Redirect to edit immediately
      // router.push(`/admin/pages/edit/${newPage.slug}`);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Auto-generate slug
  useEffect(() => {
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');
    setNewSlug(generatedSlug);
  }, [newTitle]);

  // --- RENDER ---

  if (loading && pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading pages...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Manage Pages</h1>
          <p className="text-gray-secondary mt-1">Create, edit, or delete website pages.</p>
        </div>
      </div>
      
      {/* Create New Page Card */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-10 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
          <Plus className="w-5 h-5 text-brand-primary mr-2" />
          <h3 className="font-bold text-brand-secondary">Create New Page</h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleCreatePage} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            {/* Title Input */}
            <div className="md:col-span-5">
              <label className="block text-sm font-bold text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Quality Policy"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            {/* Slug Input */}
            <div className="md:col-span-5">
              <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400 text-sm font-mono">/</span>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="quality-policy"
                  required
                  className="w-full pl-6 pr-4 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all font-mono text-sm text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`
                  w-full flex items-center justify-center py-2 px-4 rounded text-white font-bold shadow-sm transition-all
                  ${isSubmitting 
                    ? 'bg-brand-primary/70 cursor-not-allowed' 
                    : 'bg-brand-primary hover:bg-brand-deep hover:shadow-md'
                  }
                `}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Existing Pages Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-800">Existing Pages</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Page Title</th>
                <th className="px-6 py-4">URL Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-blue-50/50 transition-colors group">
                  
                  {/* Title Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3 text-brand-primary">
                        <FileText size={18} />
                      </div>
                      <span className="font-medium text-gray-900">{page.title}</span>
                    </div>
                  </td>

                  {/* Slug Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 font-mono">
                      <Globe size={14} className="mr-1 text-gray-400" />
                      /{page.slug}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/pages/edit/${page.slug}`}
                      className="inline-flex items-center px-3 py-1.5 border border-brand-primary text-brand-primary text-sm font-medium rounded hover:bg-brand-primary hover:text-white transition-colors"
                    >
                      <Edit size={14} className="mr-1.5" />
                      Edit Content
                    </Link>
                  </td>
                </tr>
              ))}
              
              {pages.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    No pages found. Create one above to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}