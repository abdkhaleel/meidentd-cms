'use client';

import React, { useState, useEffect, useCallback } from "react";
import AddSectionForm from "@/components/admin/AddSectionForm";
import TinyEditor from "@/components/admin/TinyEditor";
import { useParams } from "next/navigation";
import { Edit, Trash2, Plus, Image as ImageIcon, Save, X, Upload, Loader2, ChevronRight } from 'lucide-react';

export type ImageData = {
    id: string;
    url: string;
    altText: string;
}

export type SectionData = {
    id: string;
    title: string;
    content: string;
    order: number;
    children: SectionData[];
    images: ImageData[];
};

export type PageData = {
    id: string;
    title:string;
    sections: SectionData[];
};

// --- SINGLE SECTION COMPONENT ---
function Section({ section, onUpdate, pageId, level = 0 }: { section: SectionData; onUpdate: () => void; pageId: string; level?: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Edit States
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [order, setOrder] = useState(section.order);

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Child Section State
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  // --- HANDLERS ---
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    setIsDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/sections/${section.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete section');
      onUpdate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, order })
      });
      if (!res.ok) throw new Error('Failed to update section');
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return setError('Please select a file first.');
    
    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('sectionId', section.id);

    try {
      const res = await fetch('/api/images/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to upload image');
      
      const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      if(fileInput) fileInput.value = "";
      setImageFile(null);
      onUpdate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  // Indentation for Child Sections
  const containerClass = level === 0 
    ? "bg-white border border-gray-200 shadow-sm rounded-sm mb-6" 
    : "bg-gray-50 border-l-4 border-gray-300 ml-6 mt-6 pl-4 py-2";

  return (
    <div className={containerClass}>
      
      {/* --- SECTION HEADER --- */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
           <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-200 text-xs font-mono text-gray-600" title="Sort Order">
             {section.order}
           </span>
           <h4 className="text-lg font-bold text-brand-secondary">{section.title}</h4>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="p-2 text-gray-500 hover:text-brand-primary hover:bg-blue-50 rounded transition-colors"
            title="Edit Section"
          >
            {isEditing ? <X size={18} /> : <Edit size={18} />}
          </button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Section"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mx-4 mt-4 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* --- EDIT MODE --- */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="p-4 space-y-4 bg-blue-50/30">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
             <input 
               value={title} 
               onChange={e => setTitle(e.target.value)} 
               className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary/50 outline-none"
             />
           </div>
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
             <div className="bg-white rounded border border-gray-300">
                <TinyEditor value={content} onEditorChange={setContent} />
             </div>
           </div>
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Sort Order</label>
             <input 
               type="number" 
               value={order} 
               onChange={e => setOrder(parseInt(e.target.value))} 
               className="w-24 px-3 py-2 border border-gray-300 rounded"
             />
           </div>
           <div className="flex gap-3 pt-2">
             <button type="submit" className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-deep">
               <Save size={16} className="mr-2" /> Save Changes
             </button>
             <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
               Cancel
             </button>
           </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className="p-4">
           <div className="prose-sm max-w-none text-gray-600 mb-6 line-clamp-3 border-b border-gray-100 pb-4">
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
           </div>

           {/* --- IMAGES AREA --- */}
           <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={16} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Attached Images ({section.images.length})</span>
              </div>

              {/* Image Grid */}
              {section.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {section.images.map(img => (
                    <div key={img.id} className="relative group border border-gray-200 rounded overflow-hidden aspect-square bg-gray-50">
                      
                      {/* 
                        FIXED HERE: 
                        1. 'object-contain' ensures full image is visible 
                        2. 'p-2' adds spacing so image doesn't touch border
                      */}
                      <img 
                        src={img.url} 
                        alt={img.altText} 
                        className="w-full h-full object-contain p-2" 
                      />

                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={async () => {
                             if (!confirm('Delete image?')) return;
                             try { await fetch(`/api/images/${img.id}`, { method: 'DELETE' }); onUpdate(); } 
                             catch (err) { console.error(err); }
                          }}
                          className="text-white bg-red-600 p-2 rounded hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Image */}
              <form onSubmit={handleImageUpload} className="flex items-center gap-2">
                 <input 
                   type="file" 
                   onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                   accept="image/*"
                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                 />
                 <button 
                   type="submit" 
                   disabled={!imageFile || isUploading}
                   className="bg-brand-primary text-white p-2 rounded-full disabled:opacity-50 hover:bg-brand-deep"
                 >
                   {isUploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16} />}
                 </button>
              </form>
           </div>

           <div className="flex justify-end pt-4 border-t border-gray-100">
             <button 
               onClick={() => setShowAddChildForm(!showAddChildForm)}
               className="text-sm flex items-center text-brand-primary font-medium hover:text-brand-deep"
             >
                {showAddChildForm ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
                {showAddChildForm ? 'Cancel' : 'Add Child Section'}
             </button>
           </div>
        </div>
      )}

      {showAddChildForm && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
           <AddSectionForm
             pageId={pageId}
             parentId={section.id} 
             onSectionAdded={() => { setShowAddChildForm(false); onUpdate(); }}
           />
        </div>
      )}

      {section.children && section.children.length > 0 && (
        <div className="pb-4 pr-4">
          {section.children.map(child => (
            <Section key={child.id} section={child} onUpdate={onUpdate} pageId={pageId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE EDITOR COMPONENT ---
export default function PageEditor() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${slug}`);
      if (!res.ok) throw new Error(`Failed to fetch page data.`);
      const data = await res.json();
      setPage(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetchPageData();
  }, [slug, fetchPageData]); 

  if (loading) return <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />Loading editor...</div>;
  if (!page) return <div className="p-12 text-center text-red-500">Page not found.</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="font-medium text-gray-800">{page.title}</span>
         </div>
         <h1 className="text-3xl font-bold text-brand-primary">Editing: {page.title}</h1>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {page.sections.map(section => (
          <Section key={section.id} section={section} onUpdate={fetchPageData} pageId={page.id} />
        ))}
      </div>
      
      {/* "Add New Top Level Section" Area */}
      <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300">
         <h3 className="text-xl font-bold text-gray-400 mb-6 text-center uppercase tracking-wider">Append New Content</h3>
         <AddSectionForm pageId={page.id} onSectionAdded={fetchPageData} />
      </div>
    </div>
  );
}