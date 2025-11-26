'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Edit, Trash2, Plus, Image as ImageIcon, 
  Save, X, Upload, Loader2, GripVertical, 
  MoreVertical, ChevronRight, Eye 
} from 'lucide-react';

import AddSectionForm from "@/components/admin/AddSectionForm";
import TinyEditor from "@/components/admin/TinyEditor";

// --- TYPES ---
export type ImageData = {
  id: string;
  url: string;
  altText: string;
};

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
  title: string;
  sections: SectionData[];
};

// --- MODAL COMPONENT (Generic Wrapper) ---
function Modal({ title, onClose, children, maxWidth = "max-w-4xl" }: { title: string, onClose: () => void, children: React.ReactNode, maxWidth?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-white rounded-lg shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-brand-secondary">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- EDIT SECTION MODAL ---
function EditSectionModal({ section, onClose, onUpdate }: { section: SectionData, onClose: () => void, onUpdate: () => void }) {
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, order: section.order }) // Order handled by DnD
      });
      if (!res.ok) throw new Error('Failed to update');
      onUpdate();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal title="Edit Section Content" onClose={onClose}>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <TinyEditor value={content} onEditorChange={setContent} />
          </div>
        </div>
        {error && <p className="text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
          <button type="submit" disabled={isSaving} className="px-6 py-2 bg-brand-primary text-white rounded hover:bg-brand-deep flex items-center">
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

// --- IMAGE MANAGER MODAL ---
function ImageManagerModal({ section, onClose, onUpdate }: { section: SectionData, onClose: () => void, onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('sectionId', section.id);

    try {
      const res = await fetch('/api/images/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      onUpdate();
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imgId: string) => {
    if (!confirm('Delete this image?')) return;
    setDeletingId(imgId);
    try {
      await fetch(`/api/images/${imgId}`, { method: 'DELETE' });
      onUpdate();
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal title={`Images for: ${section.title}`} onClose={onClose} maxWidth="max-w-3xl">
      <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer relative">
         <input 
            type="file" 
            onChange={handleUpload} 
            accept="image/*"
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
         />
         <div className="flex flex-col items-center justify-center text-gray-500">
            {uploading ? <Loader2 className="w-8 h-8 animate-spin mb-2 text-brand-primary" /> : <Upload className="w-8 h-8 mb-2" />}
            <span className="font-medium">{uploading ? 'Uploading...' : 'Click or Drag to Upload New Image'}</span>
         </div>
      </div>

      {section.images.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {section.images.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
              <img src={img.url} alt={img.altText} className="w-full h-full object-contain p-2" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <button 
                   onClick={() => handleDelete(img.id)} 
                   className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                 >
                   {deletingId === img.id ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18} />}
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// --- SORTABLE SECTION ITEM (The Block) ---
function SortableSectionItem({ section, onUpdate, pageId, level }: { section: SectionData, onUpdate: () => void, pageId: string, level: number }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // DnD Hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    console.log("Called Delete Method");
    // if (!confirm('Delete this section?')){ 
    //   console.log("Delete aborted");
    //   return;
    // }
    setIsDeleting(true);
    try {

      console.log("Called Delete API");
      await fetch(`/api/sections/${section.id}`, { method: 'DELETE' });
      onUpdate();
    } catch (e) { alert('Error deleting'); }
    finally { setIsDeleting(false); }
  };

  return (
    <div ref={setNodeRef} style={style} className={`mb-4 ${level > 0 ? 'ml-8 border-l-4 border-gray-200 pl-4' : ''}`}>
      
      {/* THE INTERACTIVE BLOCK */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        <div className="flex items-center p-4">
          
          {/* Drag Handle */}
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 mr-2 text-gray-400 hover:text-brand-primary hover:bg-gray-50 rounded">
            <GripVertical size={20} />
          </button>

          {/* Title & Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
               <h4 className="text-lg font-bold text-brand-secondary">{section.title}</h4>
               <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-mono">#{section.order}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 flex gap-4">
               <span className="flex items-center"><ImageIcon size={12} className="mr-1"/> {section.images.length} Images</span>
               <span className="flex items-center"><ChevronRight size={12} className="mr-1"/> {section.children?.length || 0} Sub-sections</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button onClick={() => setShowImages(true)} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-blue-50 rounded tooltip" title="Manage Images">
              <ImageIcon size={18} />
            </button>
            <button onClick={() => setShowEdit(true)} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-blue-50 rounded" title="Edit Content">
              <Edit size={18} />
            </button>
            <button onClick={() => setShowAddChild(!showAddChild)} className={`p-2 rounded ${showAddChild ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-brand-primary hover:bg-blue-50'}`} title="Add Sub-section">
              <Plus size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <button onClick={handleDelete} disabled={isDeleting} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
              {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            </button>
          </div>
        </div>

        {/* Add Child Inline Form */}
        {showAddChild && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 animate-in slide-in-from-top-2">
            <AddSectionForm pageId={pageId} parentId={section.id} onSectionAdded={() => { setShowAddChild(false); onUpdate(); }} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showEdit && <EditSectionModal section={section} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />}
      {showImages && <ImageManagerModal section={section} onClose={() => setShowImages(false)} onUpdate={onUpdate} />}

      {/* Recursive Children Sortable Context */}
      {section.children && section.children.length > 0 && (
         <div className="mt-4">
            <SortableList items={section.children} onUpdate={onUpdate} pageId={pageId} level={level + 1} />
         </div>
      )}
    </div>
  );
}

// --- SORTABLE LIST CONTAINER (Handles DnD Logic) ---
function SortableList({ items, onUpdate, pageId, level = 0 }: { items: SectionData[], onUpdate: () => void, pageId: string, level?: number }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Optimistic UI: Sort items locally before sending to server to prevent jumpiness
  const [sortedItems, setSortedItems] = useState(items);
  useEffect(() => { setSortedItems(items); }, [items]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      
      // 1. Update UI Immediately
      const newOrder = arrayMove(sortedItems, oldIndex, newIndex);
      setSortedItems(newOrder);

      // 2. Send Update to API
      // Note: In a real production app, you'd send a batch update. 
      // Here we loop for simplicity or assume the backend handles re-indexing.
      try {
        // Basic implementation: update the dragged item's order to the new index
        // Better approach: Send the whole ID array to an endpoint like /api/sections/reorder
        await Promise.all(newOrder.map((item: { id: any; title: any; content: any; }, index: any) => 
          fetch(`/api/sections/${item.id}`, {
             method: 'PUT', 
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ order: index, title: item.title, content: item.content }) // preserving other fields
          })
        ));
        onUpdate(); // Refresh true state
      } catch (e) {
        console.error("Reorder failed", e);
      }
    }
  };

  // Sort by order before rendering
  const renderItems = [...sortedItems].sort((a, b) => a.order - b.order);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={renderItems} strategy={verticalListSortingStrategy}>
        {renderItems.map((section) => (
          <SortableSectionItem 
            key={section.id} 
            section={section} 
            onUpdate={onUpdate} 
            pageId={pageId} 
            level={level} 
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

// --- MAIN PAGE ---
export default function PageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPageData = useCallback(async () => {
    try {
      const res = await fetch(`/api/pages/${slug}`);
      if (res.ok) setPage(await res.json());
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchPageData(); }, [slug, fetchPageData]);

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-brand-primary"/></div>;
  if (!page) return <div className="p-12 text-center">Page not found</div>;

  return (
    <div className="pb-20">
      <div className="mb-8 border-b border-gray-200 pb-6">
         <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Pages</span> <ChevronRight size={14} className="mx-2"/> <span className="font-bold text-brand-primary">{page.title}</span>
         </div>
         <h1 className="text-3xl font-bold text-brand-secondary">Content Editor</h1>
      </div>

      {/* The Sortable List */}
      <div className="space-y-6">
        <SortableList items={page.sections} onUpdate={fetchPageData} pageId={page.id} />
      </div>

      {/* Add New Section at Bottom */}
      <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300 bg-gray-50/50 rounded-lg p-6">
         <h3 className="text-lg font-bold text-gray-400 mb-4 text-center uppercase tracking-widest">Add New Top Section</h3>
         <AddSectionForm pageId={page.id} onSectionAdded={fetchPageData} />
      </div>
    </div>
  );
}