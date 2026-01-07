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

export default function EmailEditorPage({ campaignId, campaignName, initialContent, audienceId, campaignType = 'general', onClose }: EmailEditorPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beeInstanceRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [performanceData, setPerformanceData] = useState<{ improvement: number; metric: string } | null>(null);

  // Unified Initialization Effect
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // 1. Prevent double-initialization if SDK instance already exists
      if (beeInstanceRef.current) return;

      try {
        setLoading(true);

        // 2. Authenticate User
        const { data: { user } } = await supabase.auth.getUser();
        
        // Stop if component unmounted while awaiting
        if (!isMounted) return; 
        
        if (!user) {
          throw new Error('Failed to authenticate user');
        }
        setUserId(user.id);

        // 3. Prepare Container (Nuclear Cleanup)
        // This clears any "ghost" iframes from previous strict-mode renders
        if (!containerRef.current) {
             throw new Error('Beefree container ref not found');
        }
        containerRef.current.innerHTML = '';

        // 4. Fetch Token
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

        // 5. Configure SDK
        const beeConfig = {
          container: 'beefree-container',
          language: 'en-US',
          onSave: async (pageJson: string, pageHtml: string) => {
             await handleSave(pageJson, pageHtml);
          },
          onSaveAsTemplate: async (pageJson: string, pageHtml: string) => {
             await handleSave(pageJson, pageHtml);
          },
          onError: (error: unknown) => {
            console.error('Beefree error:', error);
            if (isMounted) setError('An error occurred in the email editor');
          },
          onAutoSave: (pageJson: string) => {
             // Optional: console.log('Auto-saved'); 
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

        // 6. Start SDK
        // Only start if we are still mounted and the container is clear
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

    // Run the async init function
    init();
    fetchPerformanceData();

    // Cleanup function
    return () => {
      isMounted = false;
      beeInstanceRef.current = null;
      // Ensure we clean up the DOM so the next mount starts fresh
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // End useEffect

  const handleSave = async (pageJson: string, pageHtml: string) => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('campaigns')