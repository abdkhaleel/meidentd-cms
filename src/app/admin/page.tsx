'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, FileText, ExternalLink, ArrowRight, Activity, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  // 1. Sleek Loading State
  if (status === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Section with User Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-brand-primary">{session?.user?.name || 'Administrator'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            target="_blank"
            className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition-colors shadow-sm"
          >
            <ExternalLink size={16} className="mr-2" />
            View Live Site
          </Link>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-lg shadow-md shadow-brand-secondary/20 transition-all hover:-translate-y-0.5"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* 2. Quick Stats Row (Optional but stylish addition) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">System Status</p>
            <p className="text-lg font-bold text-gray-900">Online</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Current Role</p>
            <p className="text-lg font-bold text-gray-900 capitalize">Admin</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">CMS Version</p>
            <p className="text-lg font-bold text-gray-900">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* 3. Main Action Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Card: Manage Pages */}
          <Link href="/admin/pages" className="group relative overflow-hidden bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-brand-primary/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText size={100} />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                <FileText size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">Manage Pages</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Edit content, update SEO metadata, and manage the structure of your website pages.
              </p>
              
              <span className="inline-flex items-center text-sm font-semibold text-brand-primary group-hover:translate-x-1 transition-transform">
                Go to Pages <ArrowRight size={16} className="ml-2" />
              </span>
            </div>
          </Link>

          {/* Card: View Site (Mobile prominent) */}
          <Link href="/" target="_blank" className="group relative overflow-hidden bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-400/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ExternalLink size={100} />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ExternalLink size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Live Preview</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Check how your changes look on the production site immediately.
              </p>
              
              <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Visit Homepage <ArrowRight size={16} className="ml-2" />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}