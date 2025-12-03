import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Audiences from './components/Audiences';
import Analytics from './components/Analytics';
import Auth from './components/Auth';
import BuddyMascot from './components/BuddyMascot';
import EmailEditorPage from './components/EmailEditorPage';
import TotalCampaignsPage from './components/Analytics/TotalCampaignsPage';
import TotalAudiencesPage from './components/Analytics/TotalAudiencesPage';
import TotalSubscribersPage from './components/Analytics/TotalSubscribersPage';
import TotalRevenuePage from './components/Analytics/TotalRevenuePage';
import { User } from '@supabase/supabase-js';

const queryClient = new QueryClient();

interface EditorState {
  campaignId: string;
  campaignName: string;
  emailContent: any;
  audienceId?: string;
  campaignType?: 'high-value' | 'new-subscribers' | 're-engagement' | 'general';
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkUser();

    const savedState = sessionStorage.getItem('editorState');
    if (savedState && location.pathname === '/email-editor') {
      try {
        setEditorState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to restore editor state:', error);
        sessionStorage.removeItem('editorState');
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      (() => {
        setUser(session?.user ?? null);
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setEditorState(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLaunchEditor = (campaignId: string, campaignName: string, emailContent: any, audienceId?: string, campaignType?: 'high-value' | 'new-subscribers' | 're-engagement' | 'general') => {
    const state = { campaignId, campaignName, emailContent, audienceId, campaignType };
    setEditorState(state);
    sessionStorage.setItem('editorState', JSON.stringify(state));
    navigate('/email-editor');
  };

  const handleCloseEditor = () => {
    setEditorState(null);
    sessionStorage.removeItem('editorState');
    navigate(-1);
  };

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/campaigns')) return 'campaigns';
    if (path.startsWith('/audiences')) return 'audiences';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const handleViewChange = (view: string) => {
    const routes: Record<string, string> = {
      dashboard: '/',
      campaigns: '/campaigns',
      audiences: '/audiences',
      analytics: '/analytics',
      settings: '/settings',
    };
    navigate(routes[view] || '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <BuddyMascot mood="thinking" message="Loading Marketing Buddy..." />
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={checkUser} />;
  }

  if (editorState && location.pathname === '/email-editor') {
    return (
      <EmailEditorPage
        campaignId={editorState.campaignId}
        campaignName={editorState.campaignName}
        initialContent={editorState.emailContent}
        audienceId={editorState.audienceId}
        campaignType={editorState.campaignType}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <Layout
      currentView={getCurrentView()}
      onViewChange={handleViewChange}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns onLaunchEditor={handleLaunchEditor} />} />
        <Route path="/audiences" element={<Audiences />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/total-campaigns" element={<TotalCampaignsPage />} />
        <Route path="/analytics/total-audiences" element={<TotalAudiencesPage />} />
        <Route path="/analytics/total-subscribers" element={<TotalSubscribersPage />} />
        <Route path="/analytics/total-revenue" element={<TotalRevenuePage />} />
        <Route path="/settings" element={
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <BuddyMascot mood="happy" message="Settings coming soon!" />
            <h3 className="text-xl font-semibold text-gray-800 mt-6">Settings</h3>
            <p className="text-gray-600 mt-2">Configure your account and preferences</p>
          </div>
        } />
        <Route path="/email-editor" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
