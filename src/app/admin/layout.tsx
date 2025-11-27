// src/app/admin/layout.tsx
'use client'; // Required for UI state (toggling sidebar)

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Menu, X, ChevronRight } from 'lucide-react';
import AdminFooter from '@/components/admin/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Helper to check active state for styling
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 
          bg-brand-secondary text-white shadow-2xl 
          flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-brand-deep/50 bg-brand-secondary">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-wide text-white">CMS Panel</h2>
            <span className="text-[10px] uppercase tracking-wider text-brand-bright opacity-80">Admin Console</span>
          </div>
          {/* Close button for Mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden p-1 text-white hover:bg-brand-primary rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className={`
                  flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive('/admin') 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-deep/20 translate-x-1' 
                    : 'text-gray-100 hover:bg-brand-deep/30 hover:text-white hover:translate-x-1'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center">
                  <LayoutDashboard size={20} className={`mr-3 ${isActive('/admin') ? 'text-white' : 'text-brand-bright group-hover:text-white'}`} />
                  Dashboard
                </div>
                {isActive('/admin') && <ChevronRight size={16} className="opacity-70" />}
              </Link>
            </li>

            <li>
              <Link 
                href="/admin/pages" 
                className={`
                  flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive('/admin/pages') 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-deep/20 translate-x-1' 
                    : 'text-gray-100 hover:bg-brand-deep/30 hover:text-white hover:translate-x-1'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center">
                  <FileText size={20} className={`mr-3 ${isActive('/admin/pages') ? 'text-white' : 'text-brand-bright group-hover:text-white'}`} />
                  Manage Pages
                </div>
                {isActive('/admin/pages') && <ChevronRight size={16} className="opacity-70" />}
              </Link>
            </li>

            <li className="pt-4 mt-4 border-t border-brand-deep/30">
              <p className="px-4 text-xs font-semibold text-brand-bright uppercase tracking-wider mb-2 opacity-70">System</p>
              <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60 hover:bg-brand-deep/20 rounded-xl transition-colors">
                <div className="flex items-center">
                  <Settings size={20} className="mr-3" />
                  Settings
                </div>
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-brand-deep/50 bg-brand-deep/10 text-center">
          <p className="text-xs text-brand-bright/60">Meiden CMS v1.0</p>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header (Only visible on mobile) */}
        <header className="h-16 lg:hidden flex items-center px-6 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-30">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">Admin Panel</span>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)] flex flex-col">
            
            {/* Breadcrumb / Top Spacer effect */}
            <div className="mb-6 hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Overview of your system</p>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {children}
            </div>
            
            <div className="width-full mt-auto h-16">
              <AdminFooter />
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}