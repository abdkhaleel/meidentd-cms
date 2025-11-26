'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Plus, Globe, Loader2, FileText, Trash2, AlertTriangle, X } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
}

// --- DELETE CONFIRMATION MODAL ---
function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  pageTitle, 
  isDeleting 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  pageTitle: string; 
  isDeleting: boolean; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-red-900">Delete Page?</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <strong>"{pageTitle}"</strong>?
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">This action will permanently delete:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The page configuration</li>
              <li>All sections and text content</li>
              <li>All uploaded images associated with this page</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center font-bold shadow-sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} className="mr-2" /> Yes, Delete Page
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function ManagePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Pages
  const fetchPages = useCallback(async () => {
    if (pages.length === 0) setLoading(true);
    try {
      const res = await fetch('/api/pages', { cache: 'no-store' });
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
      
      // Reset and Refresh
      setNewTitle('');
      setNewSlug('');
      fetchPages();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Page Handler
  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/pages/${pageToDelete.slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json(); // Try to get error message from server
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      // Success: Remove from local state immediately
      setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
      setPageToDelete(null); // Close modal

    } catch (err) {
      alert(`Error deleting page: ${(err as Error).message}`);
    } finally {
      setIsDeleting(false);
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
            <div className="md:col-span-5">
              <label className="block text-sm font-bold text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Quality Policy"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all"
              />
            </div>
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
                  className="w-full pl-6 pr-4 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all font-mono text-sm text-gray-600"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center py-2 px-4 rounded text-white font-bold shadow-sm transition-all ${isSubmitting ? 'bg-brand-primary/70' : 'bg-brand-primary hover:bg-brand-deep'}`}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </div>
          </form>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
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
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3 text-brand-primary">
                        <FileText size={18} />
                      </div>
                      <span className="font-medium text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 font-mono">
                      <Globe size={14} className="mr-1 text-gray-400" />
                      /{page.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link 
                        href={`/admin/pages/edit/${page.slug}`}
                        className="inline-flex items-center px-3 py-1.5 border border-brand-primary text-brand-primary text-sm font-medium rounded hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        <Edit size={14} className="mr-1.5" />
                        Edit Content
                      </Link>
                      
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => setPageToDelete(page)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-500 text-sm font-medium rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    No pages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal Instance */}
      <DeleteModal 
        isOpen={!!pageToDelete}
        onClose={() => setPageToDelete(null)}
        onConfirm={handleDeletePage}
        pageTitle={pageToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}