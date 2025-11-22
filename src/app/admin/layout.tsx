// src/app/admin/layout.tsx (or wherever your admin layout is located)
import Link from 'next/link';
import type { Metadata } from 'next';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';
// 1. Import the new footer
import AdminFooter from '@/components/admin/Footer';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Content Management System Admin Panel',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      
      <aside className="w-64 flex-shrink-0 bg-brand-secondary text-white shadow-xl flex flex-col transition-all duration-300">
        
        <div className="h-16 flex items-center px-6 border-b border-brand-deep bg-brand-secondary">
          <h2 className="text-xl font-bold tracking-tight text-white">
            CMS Menu
          </h2>
        </div>

        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-100 rounded-md hover:bg-brand-primary hover:text-white transition-colors group"
              >
                <LayoutDashboard size={20} className="mr-3 text-brand-bright group-hover:text-white" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/pages" 
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-100 rounded-md hover:bg-brand-primary hover:text-white transition-colors group"
              >
                <FileText size={20} className="mr-3 text-brand-bright group-hover:text-white" />
                Manage Pages
              </Link>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-400 cursor-not-allowed opacity-70 hover:bg-brand-deep/30 rounded-md transition-colors">
                <div className="flex items-center">
                  <Settings size={20} className="mr-3" />
                  Settings
                </div>
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-brand-deep bg-brand-secondary text-center">
          <p className="text-xs text-gray-400">Meiden CMS v1.0</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        
        <div className="flex-1 p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>

        <AdminFooter />
        
      </main>
    </div>
  );
}