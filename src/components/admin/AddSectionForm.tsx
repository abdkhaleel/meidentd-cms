'use client';

import { useState } from 'react';
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
    // Wrapper: Light gray background to distinguish "Admin Mode" from standard content
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8 shadow-sm">
      
      {/* Header */}
      <h3 className="text-lg font-bold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
        {parentId ? 'Add New Nested Section' : 'Add New Top-Level Section'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
            placeholder="Enter section title..."
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
             <TinyEditor value={content} onEditorChange={setContent} />
          </div>
        </div>

        {/* Order Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            required
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`
              px-6 py-2.5 rounded-md text-white font-medium shadow-sm transition-all
              ${isSubmitting 
                ? 'bg-brand-primary/70 cursor-not-allowed' 
                : 'bg-brand-primary hover:bg-brand-deep hover:shadow-md'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Add Section'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}