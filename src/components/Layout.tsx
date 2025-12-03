import { ReactNode } from 'react';
import { LayoutDashboard, Mail, Users, BarChart3, LogOut } from 'lucide-react';
import BuddyMascot from './BuddyMascot';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}

export default function Layout({ children, currentView, onViewChange, onLogout }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'audiences', label: 'Audiences', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <nav className="bg-white shadow-lg border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-3">
              <BuddyMascot size="small" mood="happy" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Marketing Buddy
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md scale-105'
                        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="ml-4 flex items-center space-x-2 px-5 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
