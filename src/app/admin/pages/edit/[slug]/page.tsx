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
  ChevronRight, AlertTriangle, CornerDownRight 
} from 'lucide-react';

// Assuming these exist from previous steps
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
  slug: string;
  sections: SectionData[];
};

// --- 1. REUSABLE MODALS ---

// Generic Backdrop Modal
function ModalWrapper({ 
  children, 
  maxWidth = "max-w-4xl" 
}: { 
  children: React.ReactNode; 
  maxWidth?: string 
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200" />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}

// Confirmation Modal
function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isDeleting 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: React.ReactNode; 
  isDeleting: boolean; 
}) {
  if (!isOpen) return null;

  return (
    <ModalWrapper maxWidth="max-w-md">
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="text-sm text-gray-500 mb-6">{message}</div>
        
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold shadow-md flex items-center"
          >
            {isDeleting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Trash2 size={18} className="mr-2" />}
            Delete
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Edit Content Modal
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
        body: JSON.stringify({ title, content, order: section.order })
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
    <ModalWrapper>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800">Edit Section</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <form id="edit-form" onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Section Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Content Body</label>
            <TinyEditor value={content} onEditorChange={setContent} />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        </form>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button onClick={onClose} type="button" className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button 
          form="edit-form"
          type="submit" 
          disabled={isSaving} 
          className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-deep shadow-md flex items-center transition-all"
        >
          {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
          Save Changes
        </button>
      </div>
    </ModalWrapper>
  );
}

// Image Manager Modal
function ImageManagerModal({ section, onClose, onUpdate }: { section: SectionData, onClose: () => void, onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const executeDelete = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/images/${imageToDelete}`, { method: 'DELETE' });
      onUpdate();
      setImageToDelete(null);
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalWrapper maxWidth="max-w-3xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Gallery Manager</h3>
          <p className="text-xs text-gray-500">Managing images for "{section.title}"</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[60vh]">
        {/* Dropzone */}
        <div className="mb-8">
          <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-brand-primary/5 hover:border-brand-primary/50 rounded-xl transition-all cursor-pointer h-32 flex items-center justify-center group">
            <input 
                type="file" 
                onChange={handleUpload} 
                accept="image/*"
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-brand-primary transition-colors">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                ) : (
                  <Upload className="w-8 h-8 mb-2" />
                )}
                <span className="text-sm font-semibold">
                  {uploading ? 'Uploading...' : 'Click to Upload or Drag Image Here'}
                </span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {section.images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.images.map(img => (
              <div key={img.id} className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <button 
                    onClick={() => setImageToDelete(img.id)} 
                    className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 hover:scale-110 transition-all shadow-lg"
                    title="Delete Image"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                  {img.url.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={executeDelete}
        title="Delete Image?"
        isDeleting={isDeleting}
        message="This will permanently remove the image file."
      />
    </ModalWrapper>
  );
}

// --- 2. SORTABLE ITEMS ---

function SortableSectionItem({ section, onUpdate, pageId, level }: { section: SectionData, onUpdate: () => void, pageId: string, level: number }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sections/${section.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      onUpdate();
      setShowDeleteConfirm(false);
    } catch (e) { alert('Error deleting section'); } 
    finally { setIsDeleting(false); }
  };

  // Indentation Visuals
  const indentClass = level > 0 ? 'ml-6 md:ml-12' : '';
  
  return (
    <div ref={setNodeRef} style={style} className={`relative mb-4 ${indentClass}`}>
      
      {/* Connector Line for Nested Items */}
      {level > 0 && (
        <div className="absolute -left-4 md:-left-8 top-8 w-4 md:w-8 h-px bg-gray-300 border-b border-dashed border-gray-300 rounded-bl-xl" />
      )}
      {level > 0 && (
        <div className="absolute -left-4 md:-left-8 -top-4 bottom-0 w-px bg-gray-200" />
      )}

      {/* Main Card */}
      <div className={`
        bg-white rounded-xl border transition-all duration-200 group
        ${isDragging ? 'shadow-2xl scale-105 border-brand-primary' : 'shadow-sm border-gray-200 hover:shadow-md hover:border-brand-primary/30'}
      `}>
        <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
          
          {/* Drag Handle & Info */}
          <div className="flex items-center flex-1 gap-3">
            <button 
              {...attributes} 
              {...listeners} 
              className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-50 rounded-md transition-colors"
            >
              <GripVertical size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-800 text-base">{section.title}</h4>
                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                  #{section.order}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <span className={`flex items-center gap-1 ${section.images.length > 0 ? 'text-brand-primary' : 'text-gray-400'}`}>
                  <ImageIcon size={14} /> 
                  {section.images.length} Images
                </span>
                {section.children?.length > 0 && (
                   <span className="flex items-center gap-1 text-purple-600">
                     <CornerDownRight size={14} /> 
                     {section.children.length} Nested
                   </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-end gap-1 sm:border-l sm:border-gray-100 sm:pl-4">
            <button 
              onClick={() => setShowImages(true)} 
              className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
              title="Manage Images"
            >
              <ImageIcon size={18} />
            </button>
            <button 
              onClick={() => setShowEdit(true)} 
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
              title="Edit Content"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => setShowAddChild(!showAddChild)} 
              className={`p-2 rounded-lg transition-colors ${showAddChild ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}`}
              title="Add Sub-section"
            >
              <Plus size={18} />
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1"></div>
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Section"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Add Child Form Expansion */}
        {showAddChild && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-4 md:p-6 animate-in slide-in-from-top-2">
            <AddSectionForm pageId={pageId} parentId={section.id} onSectionAdded={() => { setShowAddChild(false); onUpdate(); }} />
          </div>
        )}
      </div>

      {/* Render Modals */}
      {showEdit && <EditSectionModal section={section} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />}
      {showImages && <ImageManagerModal section={section} onClose={() => setShowImages(false)} onUpdate={onUpdate} />}

      <DeleteConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={executeDelete}
        title="Delete Section?"
        isDeleting={isDeleting}
        message={
          <div className="text-left bg-red-50 p-4 rounded-lg border border-red-100 text-red-800 text-sm">
            <p className="font-bold mb-2">Warning: You are about to delete "{section.title}".</p>
            <ul className="list-disc pl-4 space-y-1 opacity-80">
              <li>All text content in this section</li>
              <li>{section.images.length} attached images</li>
              <li>{section.children.length} nested sub-sections (and their content)</li>
            </ul>
          </div>
        }
      />

      {/* Recursive Children */}
      {section.children && section.children.length > 0 && (
         <div className="mt-4">
            <SortableList items={section.children} onUpdate={onUpdate} pageId={pageId} level={level + 1} />
         </div>
      )}
    </div>
  );
}

function SortableList({ items, onUpdate, pageId, level = 0 }: { items: SectionData[], onUpdate: () => void, pageId: string, level?: number }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Prevent accidental drags on clicks
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [sortedItems, setSortedItems] = useState(items);
  useEffect(() => { setSortedItems(items); }, [items]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(sortedItems, oldIndex, newIndex);
      setSortedItems(newOrder);

      // Save new order to backend
      try {
        await Promise.all(newOrder.map((item, index) => 
          fetch(`/api/sections/${item.id}`, {
             method: 'PUT', 
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ order: index, title: item.title, content: item.content })
          })
        ));
        onUpdate(); 
      } catch (e) { console.error("Reorder failed", e); }
    }
  };

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

// --- 3. MAIN PAGE COMPONENT ---
export default function PageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPageData = useCallback(async () => {
    try {
      const res = await fetch(`/api/pages/${slug}`, { cache: 'no-store' });
      if (res.ok) setPage(await res.json());
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchPageData(); }, [slug, fetchPageData]);

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-brand-primary mb-3"/>
      <p className="text-gray-500 font-medium">Loading Editor...</p>
    </div>
  );
  
  if (!page) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
      <p className="text-gray-500">The page you are looking for does not exist.</p>
    </div>
  );

  return (
    <div className="pb-20 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
         <nav className="flex items-center text-sm text-gray-500 mb-3">
            <span className="hover:text-gray-800 transition-colors">Pages</span> 
            <ChevronRight size={14} className="mx-2 opacity-50"/> 
            <span className="font-semibold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
              {page.slug}
            </span>
         </nav>
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{page.title}</h1>
            <div className="text-sm text-gray-400 font-medium">
               {page.sections.length} Sections
            </div>
         </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6 min-h-[200px]">
        {page.sections.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium mb-2">This page is empty.</p>
              <p className="text-sm text-gray-400">Add a section below to get started.</p>
           </div>
        ) : (
           <SortableList items={page.sections} onUpdate={fetchPageData} pageId={page.id} />
        )}
      </div>

      {/* Add New Section Area */}
      <div className="mt-12">
         <div className="flex items-center mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="px-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Append New Content</span>
            <div className="h-px flex-1 bg-gray-200"></div>
         </div>
         <AddSectionForm pageId={page.id} onSectionAdded={fetchPageData} />
      </div>
    </div>
  );
}