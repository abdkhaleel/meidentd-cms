import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h2>CMS Menu</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/pages">Manage Pages</Link>
            </li>
            {/* We can add more links later, e.g., for Products, Careers */}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}