import { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';
import { X, Loader2, AlertCircle, CheckCircle, ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';
import CampaignStatsHeader, { CampaignType } from './CampaignStatsHeader';

interface EmailEditorPageProps {
  campaignId: string;
  campaignName: string;
  initialContent?: any;
  audienceId?: string;
  campaignType?: CampaignType;
  onClose: () => void;
}

export default function EmailEditorPage({ 
  campaignId, 
  campaignName, 
  initialContent, 
  audienceId, 
  campaignType = 'general', 
  onClose 
}: EmailEditorPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beeInstanceRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [performanceData, setPerformanceData] = useState<{ improvement: number; metric: string } | null>(null);

  // ---------------------------------------------------------------------------
  // Helper Functions (Defined here to be accessible to the effect and UI)
  // ---------------------------------------------------------------------------

  const handleSave = async (pageJson: string, pageHtml: string) => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ 
          email_html: pageJson, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving campaign:', err);
      setError('Failed to save email design');
    } finally {
      setSaving(false);
    }
  };

  const fetchPerformanceData = async (uid: string) => {
    try {
      const { data: campaigns } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (!campaigns || campaigns.length === 0) return;

      const lastCampaign = campaigns[0];
      const totalSent = lastCampaign.sent_count || 0;

      if (totalSent === 0) return;

      const actualOpenRate = ((lastCampaign.opened_count || 0) / totalSent) * 100;
      const industryAvgOpenRate = 22;

      const actualClickRate = ((lastCampaign.clicked_count || 0) / totalSent) * 100;
      const industryAvgClickRate = 2.8;

      const openRateImprovement = ((actualOpenRate - industryAvgOpenRate) / industryAvgOpenRate) * 100;
      const clickRateImprovement = ((actualClickRate - industryAvgClickRate) / industryAvgClickRate) * 100;

      if (openRateImprovement > clickRateImprovement && openRateImprovement > 10) {
        setPerformanceData({ improvement: Math.round(openRateImprovement), metric: 'open rate' });
      } else if (clickRateImprovement > 10) {
        setPerformanceData({ improvement: Math.round(clickRateImprovement), metric: 'click rate' });
      } else if (openRateImprovement > 5) {
        setPerformanceData({ improvement: Math.round(openRateImprovement), metric: 'engagement' });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  // ---------------------------------------------------------------------------
  // Main Initialization Effect
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      // 1. Safety Check: If SDK is already running, do not re-run.
      if (beeInstanceRef.current) return;

      try {
        setLoading(true);

        // 2. Get User
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        
        if (!user) {
          throw new Error('Failed to authenticate user');
        }
        setUserId(user.id);
        
        // Start background fetch for stats
        fetchPerformanceData(user.id);

        // 3. NUCLEAR CLEANUP: Clear container to prevent "ghost" iframes
        if (!containerRef.current) {
           throw new Error('Beefree container ref not found');
        }
        containerRef.current.innerHTML = '';

        // 4. Get Beefree Auth Token
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase configuration missing');
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/beefree-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ uid: `${user.id}-${campaignId}` })
        });

        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to authenticate with Beefree');
        }

        const token = await response.json();

        // 5. Configure the SDK
        const beeConfig = {
          container: 'beefree-container',
          language: 'en-US',
          onSave: (pageJson: string, pageHtml: string) => handleSave(pageJson, pageHtml),
          onSaveAsTemplate: (pageJson: string, pageHtml: string) => handleSave(pageJson, pageHtml),
          onError: (error: unknown) => {
            console.error('Beefree error:', error);
            if (isMounted) setError('An error occurred in the email editor');
          },
          onAutoSave: (pageJson: string) => {
             // console.log('Auto-saved');
          },
          onLoad: () => {
             console.log('Beefree editor loaded successfully');
             if (isMounted) setLoading(false);
          },
        };

        const template = initialContent || {
            page: {
                body: {
                    container: { style: { 'background-color': '#ffffff' } },
                    rows: [{
                        columns: [{
                            modules: [{
                                type: 'mailup-bee-newsletter-modules-text',
                                descriptor: {
                                    text: {
                                        html: '<p style="text-align: center;">Welcome to your email editor!</p>'
                                    }
                                }
                            }]
                        }]
                    }]
                }
            }
        };

        // 6. Start the SDK (Only if we are still mounted)
        if (isMounted && containerRef.current) {
             const bee = new BeefreeSDK(token);
             beeInstanceRef.current = bee;
             await bee.start(beeConfig, template);
        }

      } catch (err: any) {
        if (isMounted) {
          console.error('Editor init error:', err);
          setError(err.message || 'Failed to load editor');
          setLoading(false);
        }
      }
    };

    initEditor();

    // 7. Cleanup Function
    return () => {
      isMounted = false;
      beeInstanceRef.current = null;
      // Wipe the DOM one last time to ensure next mount is clean
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleExitEditor = () => {
    if (confirm('Are you sure you want to exit? Make sure you saved your changes.')) {
      onClose();
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (error && !beeInstanceRef.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Editor</h2>
              <p className="text-gray-600 text-center mb-4">{error}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 w-full">
                <p className="text-sm text-red-600 text-center">
                  Please ensure your Beefree credentials are properly configured in your project settings.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {audienceId && (
        <CampaignStatsHeader
          campaignId={campaignId}
          audienceId={audienceId}
          campaignType={campaignType}
        />
      )}

      <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors group"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-8 bg-white/30"></div>
          <BuddyMascot size="small" mood="excited" />
          <div>
            <h1 className="text-xl font-bold">Email Editor</h1>
            <p className="text-sm text-white/90">{campaignName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {saving && (
            <div className="flex items-center space-x-2 text-white/90">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}

          {saveSuccess && (
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Saved!</span>
            </div>
          )}

          <button
            onClick={handleExitEditor}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Exit Editor</span>
          </button>
        </div>
      </div>

      {performanceData && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <p className="text-base font-bold">
                  Your last email campaign outperformed the average by {performanceData.improvement}%!
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-semibold">{performanceData.metric.toUpperCase()}</span>
              <div className="w-px h-4 bg-white/40"></div>
              <span className="text-sm">+{performanceData.improvement}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-4" />
              <BuddyMascot mood="thinking" message="Loading your email editor..." />
            </div>
          </div>
        )}

        <div
          id="beefree-container"
          ref={containerRef}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </div>

      {error && !beeInstanceRef.current && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 p-1 hover:bg-red-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}