'use client';

import React, { useState, useEffect, useCallback } from "react";
import AddSectionForm from "@/components/admin/AddSectionForm";
import { useParams } from "next/navigation";
import TinyEditor from "@/components/admin/TinyEditor";

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

// function Section({ section }: { section: SectionData }) {
//     return (
//     <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0 10px 20px' }}>
//       <h4>{section.title}</h4>
//       <p>ID: {section.id}</p>
//       <p>Order: {section.order}</p>
//       <div dangerouslySetInnerHTML={{ __html: section.content }} />

//       {/* This is the magic: Recursively render child sections */}
//       {section.children && section.children.length > 0 && (
//         <div>
//           {section.children.map(child => (
//             <Section key={child.id} section={child} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

function Section({ section, onUpdate }: { section: SectionData; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [order, setOrder] = useState(section.order);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    setIsDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to delete section. Status: ${res.status}`);
      }
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, order })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to update section. Status: ${res.status}`);
      }

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- Add this to prevent default form submission
    if (!imageFile) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('sectionId', section.id);

    try {
      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      // Find the file input element and reset it
      const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      if(fileInput) fileInput.value = "";
      
      setImageFile(null); // Clear the file from state
      onUpdate(); // Refresh the page to show the new image
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0 10px 20px' }}>
      
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ display: 'block', width: '90%', marginBottom: '10px' }}/>
          <TinyEditor value={content} onEditorChange={setContent} />
          <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value))} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <h4>{section.title}</h4>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
          <p><small>Order: {section.order}</small></p>
        </div>
      )}

      <div>
        <strong>Images:</strong>
        {section.images && section.images.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            {section.images.map(img => (
              <div key={img.id}>
                <img src={img.url} alt={img.altText} width="100" />
                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to delete this image?')) return;
                    try {
                      const res = await fetch(`/api/images/${img.id}`, { method: 'DELETE' });
                      if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || 'Failed to delete');
                      }
                      onUpdate(); // Refresh the page
                    } catch (err) {
                      setError((err as Error).message);
                    }
                  }}
                  style={{ marginTop: '5px', display: 'block', width: '100%' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No images for this section.</p>
        )}
      </div>

      <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <form onSubmit={handleImageUpload} style={{ marginTop: '10px', borderTop: '1-px solid #eee', paddingTop: '10px' }}>
          <label>Upload New Image:</label>
          <input 
            type="file" 
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
            accept="image/png, image/jpeg, image/gif" // Good practice to specify accepted file types
          />
          <button type="submit" disabled={!imageFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setIsEditing(!isEditing)} disabled={isDeleting}>
          {isEditing ? 'Close' : 'Edit'}
        </button>
        <button onClick={handleDelete} disabled={isDeleting || isEditing}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {section.children && section.children.length > 0 && (
        <div>
          {section.children.map(child => (
            <Section key={child.id} section={child} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

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
      if (!res.ok) {
        throw new Error(`Failed to fetch page data. Status: ${res.status}`);
      }
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

  if (loading) return <p>Loading editor...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!page) return <p>Page not found.</p>;

  return (
    <div>
      <h2>Editing Page: {page.title}</h2>
      <hr />
      <h3>Content Sections</h3>
      <div>
        {page.sections.map(section => (
          <Section key={section.id} section={section} onUpdate={fetchPageData} />
        ))}
      </div>

      <AddSectionForm pageId={page.id} onSectionAdded={fetchPageData} />
    </div>
  );
}