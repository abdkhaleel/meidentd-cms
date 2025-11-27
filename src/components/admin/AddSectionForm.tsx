'use client';

import { useState } from 'react';
import { Plus, Type, ListOrdered, AlertCircle, Layers, Save, Loader2 } from 'lucide-react';
import TinyEditor from './TinyEditor';

interface AddSectionFormProps {
  pageId: string;
  parentId?: string;
  onSectionAdded: () => void;
}

export default function AddSectionForm({ pageId, parentId, onSectionAdded }: AddSectionFormProps) {
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
          parentId,
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md duration-300 overflow-hidden my-8">
      
      {/* Decorative Header */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${parentId ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-brand-primary'}`}>
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">
              {parentId ? 'Nested Section' : 'New Section'}
            </h3>
            <p className="text-xs text-gray-500">
              {parentId ? 'Adding content inside a parent section' : 'Adding a top-level block to the page'}
            </p>
          </div>
        </div>
        {/* Optional: Add a subtle badge or indicator here if needed */}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Title Input (Span 3 on desktop) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Section Title <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type size={16} className="text-gray-400 group-focus-within:text-brand-primary transition-colors" />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
                placeholder="e.g., 'Company History' or 'Services'"
              />
            </div>
          </div>

          {/* Order Input (Span 1 on desktop) */}
          <div className="md:col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Order
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ListOrdered size={16} className="text-gray-400 group-focus-within:text-brand-primary transition-colors" />
              </div>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10))}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Content Body
          </label>
          {/* Wrapper to give the editor the same focus ring style */}
          <div className="rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all shadow-sm">
             <TinyEditor value={content} onEditorChange={setContent} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-2 flex items-center justify-end border-t border-gray-50">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-200
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-brand-primary hover:bg-brand-deep hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={3} />
                <span>Add Section</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}