'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
}

export default function TinyEditor({ value, onEditorChange }: TinyEditorProps) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <div className="rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary transition-all">
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={onEditorChange}
        init={{
          height: 400, // Increased height slightly for better table editing
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | table | help',
            
          table_default_attributes: {
            style: 'width: 100%; border-collapse: collapse;'
          },
          
          // STYLING UPDATE
          content_style: `
            body { 
              font-family: Verdana, Arial, sans-serif; 
              font-size: 15px; 
              color: #333333; 
              line-height: 1.75;
              margin: 1.5rem;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #113388;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            a { color: #113388; text-decoration: none; }
            p { margin-bottom: 1em; }

            /* --- ENHANCED TABLE STYLING --- */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 2em;
              /* Brand Accent Top Border */
              border-top: 3px solid #113388; 
              /* Subtle Shadow for depth */
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              background-color: #ffffff;
            }
            
            th, td {
              border-bottom: 1px solid #e5e7eb; /* Light gray horizontal lines */
              border-right: 1px solid #e5e7eb;  /* Light vertical lines */
              padding: 14px 16px; /* Generous padding */
              text-align: left;
              vertical-align: middle;
            }

            /* Remove right border from last column for cleaner look */
            th:last-child, td:last-child {
              border-right: none;
            }

            /* Header Styling */
            th {
              background-color: #f8fafc; /* Very light slate */
              color: #113366; /* Brand Secondary */
              font-weight: 700;
              font-size: 0.9em; /* Slightly smaller text */
              text-transform: uppercase; /* Corporate look */
              letter-spacing: 0.05em;
            }

            /* Row Interactions */
            tr {
              transition: background-color 0.2s;
            }
            tr:hover td {
              background-color: #f1f5f9; /* Light hover effect */
            }
            
            /* Zebra Striping (Optional - subtle) */
            tr:nth-child(even) {
              background-color: #fcfcfc;
            }
          `
        }}
      />
    </div>
  );
}