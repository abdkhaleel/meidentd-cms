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
    // Wrapper to match the styling of standard inputs (borders, rounded corners)
    <div className="rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary transition-all">
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={onEditorChange}
        init={{
          height: 300,
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
          // CRITICAL UPDATE:
          // This CSS ensures the editor preview matches your actual site theme
          // (Verdana font, 15px size, Brand Blue headings)
          content_style: `
            body { 
              font-family: Verdana, Arial, sans-serif; 
              font-size: 15px; 
              color: #333333; 
              line-height: 1.75;
              margin: 1rem;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #113388;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            a {
              color: #113388;
              text-decoration: none;
            }
            p {
              margin-bottom: 1em;
            }
          `
        }}
      />
    </div>
  );
}