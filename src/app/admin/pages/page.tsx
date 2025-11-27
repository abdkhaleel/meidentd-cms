'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Edit, Plus, Globe, Loader2, FileText, Trash2, 
  AlertTriangle, X, Type, Search, LayoutTemplate 
} from 'lucide-react';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center p-8 pb-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete this page?</h3>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            You are about to delete <strong className="text-gray-800">"{pageTitle}"</strong>. 
            This action cannot be undone.
          </p>
        </div>

        <div className="px-8 pb-6">
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-left">
            <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Warning</p>
            <p className="text-xs text-red-700">
              All sections, images, and content associated with this URL slug will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex border-t border-gray-100 bg-gray-50">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-4 text-gray-700 font-medium hover:bg-gray-100 transition-colors border-r border-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-4 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            Delete Page
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
      
      setNewTitle('');
      setNewSlug('');
      fetchPages();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/pages/${pageToDelete.slug}`, { method: 'DELETE' });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
      setPageToDelete(null);
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pages Manager</h1>
          <p className="text-gray-500 mt-2">Create and organize the structural pages of your website.</p>
        </div>
      </div>
      
      {/* Create New Page Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-primary/10 rounded-md text-brand-primary">
              <Plus size={18} />
            </div>
            <h3 className="font-bold text-gray-800">Create New Page</h3>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <form onSubmit={handleCreatePage} className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
            
            {/* Title Input */}
            <div className="w-full lg:flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Page Title</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type size={16} className="text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. About Us"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Slug Input */}
            <div className="w-full lg:flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">URL Slug</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={16} className="text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="about-us"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-mono text-sm text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full lg:w-auto">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`
                  w-full lg:w-auto px-6 py-2.5 rounded-lg font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-all
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-brand-primary hover:bg-brand-deep hover:shadow-md hover:-translate-y-0.5'
                  }
                `}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} strokeWidth={3} />}
                <span>Create Page</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Existing Pages List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate size={20} className="text-gray-400" />
            <h2 className="font-bold text-lg text-gray-800">All Pages</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full ml-2">
              {pages.length}
            </span>
          </div>
        </div>

        {loading && pages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-3" />
            <p className="text-gray-400 text-sm">Loading page list...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                  <th className="px-6 py-4 rounded-tl-lg">Page Name</th>
                  <th className="px-6 py-4">Live URL</th>
                  <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((page) => (
                  <tr key={page.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/5 text-brand-primary flex items-center justify-center mr-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                            {page.title}
                          </p>
                          <p className="text-xs text-gray-400">ID: {page.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`/${page.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-mono hover:bg-white hover:shadow-sm hover:text-brand-primary border border-transparent hover:border-gray-200 transition-all"
                      >
                        <Globe size={12} className="mr-2 opacity-50" />
                        /{page.slug}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <Link 
                          href={`/admin/pages/edit/${page.slug}`}
                          className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                        >
                          <Edit size={14} className="mr-2" />
                          Edit
                        </Link>
                        
                        <button
                          onClick={() => setPageToDelete(page)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pages.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <Search className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-900 font-medium">No pages found</p>
                        <p className="text-gray-500 text-sm mt-1">Get started by creating your first page above.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

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