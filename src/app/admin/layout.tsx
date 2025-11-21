import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, ChevronRight } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // h-screen ensures the layout fills the window height and sidebar stays fixed
    <div className="flex h-screen bg-gray-50">
      
      {/* 
        SIDEBAR 
        Fixed width (w-64), Dark Brand Blue background, White text
      */}
      <aside className="w-64 flex-shrink-0 bg-brand-secondary text-white shadow-xl flex flex-col transition-all duration-300">
        
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-brand-deep bg-brand-secondary">
          <h2 className="text-xl font-bold tracking-tight text-white">
            CMS Menu
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            
            {/* Dashboard Link */}
            <li>
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-100 rounded-md hover:bg-brand-primary hover:text-white transition-colors group"
              >
                <LayoutDashboard size={20} className="mr-3 text-brand-bright group-hover:text-white" />
                Dashboard
              </Link>
            </li>

            {/* Manage Pages Link */}
            <li>
              <Link 
                href="/admin/pages" 
                className="flex items-center px-3 py-3 text-sm font-medium text-gray-100 rounded-md hover:bg-brand-primary hover:text-white transition-colors group"
              >
                <FileText size={20} className="mr-3 text-brand-bright group-hover:text-white" />
                Manage Pages
              </Link>
            </li>

            {/* Placeholder for Future Links */}
            <li>
              <button className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-400 cursor-not-allowed opacity-70 hover:bg-brand-deep/30 rounded-md transition-colors">
                <div className="flex items-center">
                  <Settings size={20} className="mr-3" />
                  Settings
                </div>
                {/* <ChevronRight size={14} /> */}
              </button>
            </li>

          </ul>
        </nav>

        {/* Sidebar Footer / Version Info */}
        <div className="p-4 border-t border-brand-deep bg-brand-secondary text-center">
          <p className="text-xs text-gray-400">Meiden CMS v1.0</p>
        </div>
      </aside>

      {/* 
        MAIN CONTENT WRAPPER
        flex-1 takes remaining width. 
        overflow-y-auto allows scrolling content independent of sidebar.
      */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* 
           p-8 adds padding around your page content (Dashboard, Forms, etc.) 
           Using a container inside helps limit max width on huge screens.
        */}
        <div className="p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}