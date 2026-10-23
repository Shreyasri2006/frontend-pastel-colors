import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Map, Bell, FileText, Stethoscope, LogOut,
  Menu, X, Droplets, User, Activity, ChevronRight, Shield
} from 'lucide-react';
import { getRoleLabel } from '../utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/map', icon: Map, label: 'Risk Map' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/locations', icon: Activity, label: 'Locations' },
  { path: '/health-reports', icon: FileText, label: 'Health Reports' },
  { path: '/consultations', icon: Stethoscope, label: 'Consultations' },
  { path: '/water-sources', icon: Droplets, label: 'Water Sources' },
];

function NavLink({ item, active, onClick }: { item: typeof navItems[0]; active: boolean; onClick?: () => void }) {
  return (
    <Link to={item.path} onClick={onClick} className={active ? 'nav-link-active' : 'nav-link'}>
      <item.icon className="w-4 h-4 flex-shrink-0" />
      <span>{item.label}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-orange-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-200 to-sky-100 flex items-center justify-center text-xl">
            💧
          </div>
          <div>
            <h1 className="font-bold text-stone-800 text-base leading-tight">JalRaksha AI</h1>
            <p className="text-stone-500 text-xs">Health Monitoring System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-orange-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-purple-200 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-800 truncate">{user?.name}</p>
            <p className="text-xs text-stone-500">{getRoleLabel(user?.role || '')}</p>
          </div>
          <Shield className="w-3.5 h-3.5 text-stone-500" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Navigation</p>
        {navItems.map(item => (
          <NavLink key={item.path} item={item} active={location.pathname === item.path} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-orange-100">
        <div className="px-3 py-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            <span className="text-xs text-stone-500">System Online</span>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-link w-full text-pink-700 hover:bg-pink-200/50 hover:text-pink-600">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-orange-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-orange-50/80 border-r border-orange-100">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-orange-50 border-r border-orange-100 z-10">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-stone-700 hover:text-stone-800">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-100">
          <button onClick={() => setSidebarOpen(true)} className="text-stone-700 hover:text-stone-800">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="font-bold text-stone-800 text-sm">JalRaksha AI</span>
          </div>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
