'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export type SectionData = {
    id: string;
    title: string;
    content: string;
    order: number;
    children: SectionData[];
};

export type PageData = {
    id: string;
    title:string;
    sections: SectionData[];
};

function Section({ section }: { section: SectionData }) {
    return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0 10px 20px' }}>
      <h4>{section.title}</h4>
      <p>ID: {section.id}</p>
      <p>Order: {section.order}</p>
      <div dangerouslySetInnerHTML={{ __html: section.content }} />

      {/* This is the magic: Recursively render child sections */}
      {section.children && section.children.length > 0 && (
        <div>
          {section.children.map(child => (
            <Section key={child.id} section={child} />
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

    useEffect(() => {
        if(!slug) return;

        async function fetchPageData() {
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
        }

        fetchPageData();
    }, [slug]);

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
            <Section key={section.id} section={section} />
            ))}
        </div>
        {/* We will add a "Add New Section" button here */}
        </div>
    );
}