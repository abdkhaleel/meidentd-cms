'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, FileText, PlusCircle, Settings, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  // 1. Consistent Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-100 bg-gray-50">
      
      {/* Top Navigation Bar */}
      <nav className="bg-brand-secondary text-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutDashboard size={24} className="text-brand-bright" />
            <span className="text-xl font-bold tracking-tight">Meiden CMS</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300 hidden md:inline">
              Logged in as <strong className="text-white">{session?.user?.name || 'Admin'}</strong>
            </span>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-deep text-xs uppercase font-bold py-2 px-4 rounded transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-10">
        
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Dashboard Overview</h1>
          <p className="text-gray-secondary">
            Welcome back. Manage your website pages, sections, and media content from here.
          </p>
        </div>

        {/* Dashboard Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: View Site */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-brand-primary rounded-full group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <ExternalLink size={24} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">View Live Site</h3>
            <p className="text-sm text-gray-500 mb-4">Preview how your content looks to visitors.</p>
            <Link href="/" className="text-sm font-bold text-brand-primary hover:text-brand-deep flex items-center">
              Go to Homepage &rarr;
            </Link>
          </div>

          {/* Card 2: Manage Pages (Placeholder for future functionality) */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-brand-primary rounded-full group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Pages</h3>
            <p className="text-sm text-gray-500 mb-4">Edit existing page content and structure.</p>
            <Link href="/admin/pages" className="text-sm font-bold text-brand-primary hover:text-brand-deep flex items-center">
              View Pages &rarr;
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}