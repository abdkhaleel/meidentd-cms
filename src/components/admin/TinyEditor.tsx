'use client';

import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from 'lucide-react';

interface TinyEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
  disabled?: boolean;
}

// 1. EXTRACTED STYLES FOR CLEANLINESS
// This CSS makes the content inside the editor look exactly like your frontend components.
const PROFESSIONAL_CONTENT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  body {
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: #334155; /* Slate-700 */
    margin: 2rem;
    padding-bottom: 2rem;
    overflow-x: hidden;
  }

  /* --- TYPOGRAPHY HIERARCHY --- */
  h1, h2, h3, h4, h5, h6 {
    color: #0f172a; /* Slate-900 */
    font-weight: 700;
    margin-top: 2em;
    margin-bottom: 0.75em;
    line-height: 1.25;
    letter-spacing: -0.025em;
  }

  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.875rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5em; }
  h3 { font-size: 1.5rem; }

  p { margin-bottom: 1.5em; max-width: 75ch; }
  
  /* --- LINKS & INTERACTIONS --- */
  a {
    color: #2563eb; /* Blue-600 */
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  a:hover { border-bottom-color: #2563eb; }

  /* --- DATA TABLES (SaaS Style) --- */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 2.5em 0;
    border: 1px solid #cbd5e1; /* Slate-300 */
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  thead { background-color: #f8fafc; }

  th {
    color: #475569; /* Slate-600 */
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 16px 24px;
    border-bottom: 1px solid #cbd5e1;
    text-align: left;
  }

  td {
    padding: 16px 24px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.95rem;
    color: #334155;
    background: #fff;
  }

  tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background-color: #f8fafc; }

  /* --- RICH MEDIA & CALLOUTS --- */
  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2em auto;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  blockquote {
    border-left: 4px solid #3b82f6; /* Blue-500 */
    background: #eff6ff; /* Blue-50 */
    margin: 2em 0;
    padding: 1.5em 2em;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #1e40af;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background-color: #f1f5f9;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.875em;
    color: #0f172a;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2em 0;
  }

  /* --- LISTS --- */
  ul, ol { padding-left: 1.5em; margin-bottom: 1.5em; }
  li { margin-bottom: 0.5em; padding-left: 0.5em; }
  ul li::marker { color: #3b82f6; } /* Custom bullet color */
`;

export default function TinyEditor({ value, onEditorChange, disabled = false }: TinyEditorProps) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-none">
      
      {/* 1. Loading State (Prevents Layout Shift) */}
      {!isEditorLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg h-[600px]">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" strokeWidth={1.5} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Editor...</span>
        </div>
      )}

      {/* 2. Editor Container */}
      <div 
        className={`
          group relative overflow-hidden rounded-lg transition-all duration-300
          ${isEditorLoaded ? 'opacity-100 shadow-sm' : 'opacity-0'}
          ${disabled ? 'pointer-events-none opacity-60 bg-slate-50' : 'bg-white'}
          border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10
        `}
      >
        <Editor
          apiKey={apiKey}
          value={value}
          onEditorChange={onEditorChange}
          onInit={() => setIsEditorLoaded(true)}
          disabled={disabled}
          init={{
            height: 600, // Generous height for professional writing
            width: '100%',
            menubar: false,
            statusbar: true,
            resize: true,
            branding: false,
            elementpath: false, // Hides the "p > span" path at bottom for cleaner UI
            
            // --- PROFESSIONAL PLUGIN SUITE ---
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount', 'directionality'
            ],

            // --- INTUITIVE TOOLBAR GROUPING ---
            toolbar: 
              'undo redo | blocks | ' +
              'bold italic underline | alignleft aligncenter alignright | ' +
              'bullist numlist | link table image | ' +
              'removeformat code fullscreen',

            // --- ADVANCED FORMATTING OPTIONS (The "Pro" Touch) ---
            // This allows users to select semantic styles instead of just H1/H2
            style_formats: [
              { title: 'Headings', items: [
                { title: 'Section Header (H2)', format: 'h2' },
                { title: 'Subsection (H3)', format: 'h3' }
              ]},
              { title: 'Blocks', items: [
                { title: 'Paragraph', format: 'p' },
                { title: 'Quote', format: 'blockquote' },
                { title: 'Code Block', format: 'pre' }
              ]},
              { title: 'Inline', items: [
                { title: 'Bold', format: 'bold' },
                { title: 'Code', icon: 'code', format: 'code' }
              ]}
            ],

            // --- IMAGE HANDLING ---
            image_caption: true,
            image_advtab: true,
            
            // --- INJECTED CSS ---
            content_style: PROFESSIONAL_CONTENT_STYLE,
            
            // --- UI POLISH ---
            skin: 'oxide', // 'oxide-dark' if your app is dark mode
            icons: 'thin', // More modern, refined icon set
            
            // Ensures the editor iframe background matches the container
            body_class: 'prose-editor', 
          }}
        />
      </div>
      
      {/* 3. Helper Text (Optional Professional Touch) */}
      <div className="flex justify-between mt-2 px-1">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
          Markdown supported via shortcuts
        </p>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
           {/* You can map word count from editor state here if needed */}
           <span className="uppercase tracking-wider font-medium">Rich Text Mode</span>
        </div>
      </div>

    </div>
  );
}