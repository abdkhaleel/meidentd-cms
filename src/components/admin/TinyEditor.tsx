'use client';

import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from 'lucide-react';

interface TinyEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
}

export default function TinyEditor({ value, onEditorChange }: TinyEditorProps) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  return (
    <div className="relative group">
      
      {/* 1. Loading Skeleton / Spinner (Visible until TinyMCE loads) */}
      {!isEditorLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
          <span className="text-xs font-medium text-gray-500 animate-pulse">Loading Editor...</span>
        </div>
      )}

      {/* 2. Editor Container */}
      <div 
        className={`
          overflow-hidden rounded-xl border transition-all duration-300
          ${isEditorLoaded ? 'bg-white shadow-sm' : 'opacity-0'}
          focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary
          border-gray-200 hover:border-gray-300
        `}
      >
        <Editor
          apiKey={apiKey}
          value={value}
          onEditorChange={onEditorChange}
          onInit={() => setIsEditorLoaded(true)}
          init={{
            height: 500,
            width: '100%',
            menubar: false,
            statusbar: true, // Keep resizing handle
            resize: true, // Allow vertical resizing
            branding: false, // Remove "Powered by TinyMCE"
            
            // Modern Plugin List
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount', 'directionality'
            ],

            // Desktop Toolbar
            toolbar: 
              'undo redo | formatselect | ' +
              'bold italic underline strikethrough | alignleft aligncenter alignright | ' +
              'bullist numlist | table link image | removeformat fullscreen',

            // Mobile Specific Configuration
            mobile: {
              menubar: false,
              plugins: ['autosave', 'lists', 'autolink'],
              toolbar: 'undo redo | bold italic | bullist numlist | link image'
            },

            // Make tables responsive by default
            table_default_attributes: {
              style: 'width: 100%; border-collapse: collapse;'
            },
            
            // THEME & CONTENT STYLING
            content_style: `
              /* Base Typography */
              body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 16px; 
                color: #374151; /* Gray-700 */
                line-height: 1.8;
                margin: 1.5rem;
                overflow-x: hidden; /* Prevent horizontal scroll on body */
              }

              /* Headings */
              h1, h2, h3, h4, h5, h6 {
                color: #113388; /* Brand Primary */
                font-weight: 700;
                margin-top: 1.5em;
                margin-bottom: 0.75em;
                line-height: 1.3;
              }

              /* Links */
              a { 
                color: #2563eb; 
                text-decoration: underline; 
                text-decoration-thickness: 2px;
                text-underline-offset: 2px;
                transition: color 0.2s;
              }
              a:hover { color: #1e40af; }

              /* Paragraphs & Lists */
              p { margin-bottom: 1.25em; }
              ul, ol { padding-left: 1.5em; margin-bottom: 1.25em; }
              li { margin-bottom: 0.5em; }

              /* Images: Make them Responsive */
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                margin: 1em 0;
              }

              /* Blockquotes */
              blockquote {
                border-left: 4px solid #113388;
                background-color: #f8fafc;
                margin: 1.5em 0;
                padding: 1em 1.5em;
                font-style: italic;
                color: #4b5563;
                border-radius: 0 8px 8px 0;
              }

              /* --- ENHANCED TABLE STYLING --- */
              table {
                width: 100%;
                border-collapse: separate; /* Allows border radius */
                border-spacing: 0;
                margin: 2em 0;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
              }
              
              /* Header Styling */
              thead tr {
                background-color: #f1f5f9; /* Slate-100 */
                border-bottom: 2px solid #e2e8f0;
              }
              
              th {
                color: #1e293b; /* Slate-800 */
                font-weight: 700;
                font-size: 0.85em;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 12px 16px;
                text-align: left;
                border-bottom: 2px solid #cbd5e1;
              }

              /* Body Styling */
              td {
                padding: 12px 16px;
                border-bottom: 1px solid #e2e8f0;
                color: #475569;
              }

              /* Remove bottom border from last row */
              tr:last-child td {
                border-bottom: none;
              }

              /* Row Hover Effect */
              tbody tr:hover {
                background-color: #f8fafc;
              }

              /* Code Blocks */
              pre {
                background: #1e293b;
                color: #e2e8f0;
                padding: 1em;
                border-radius: 8px;
                overflow-x: auto;
              }
            `
          }}
        />
      </div>
    </div>
  );
}