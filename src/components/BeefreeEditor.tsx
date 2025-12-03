import { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';
import { Loader2, AlertCircle } from 'lucide-react';

interface BeefreeEditorProps {
  onSave?: (html: string, json: string) => void;
  initialContent?: any;
  userId?: string;
}

export default function BeefreeEditor({ onSave, initialContent, userId }: BeefreeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const beeInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeEditor() {
      try {
        setLoading(true);
        setError(null);

        const beeConfig = {
          container: 'beefree-container',
          language: 'en-US',
          onSave: (pageJson: string, pageHtml: string) => {
            console.log('Email saved!');
            if (onSave) {
              onSave(pageHtml, pageJson);
            }
          },
          onSaveAsTemplate: (pageJson: string, pageHtml: string) => {
            console.log('Saved as template!');
            if (onSave) {
              onSave(pageHtml, pageJson);
            }
          },
          onError: (error: unknown) => {
            console.error('Beefree error:', error);
            setError('An error occurred in the email editor');
          },
          onAutoSave: (pageJson: string) => {
            console.log('Auto-saved');
          }
        };

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
          body: JSON.stringify({ uid: userId || 'marketing-buddy-user' })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to authenticate with Beefree');
        }

        const token = await response.json();

        if (!mounted) return;

        const bee = new BeefreeSDK(token);
        beeInstanceRef.current = bee;

        const template = initialContent || {
          page: {
            body: {
              rows: [
                {
                  columns: [
                    {
                      "grid-columns": 12,
                      modules: [
                        {
                          type: 'mailup-bee-newsletter-modules-text',
                          descriptor: {
                            text: {
                              html: '<p style="font-size: 16px; line-height: 1.5;">Start designing your email campaign here!</p>'
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        };

        await bee.start(beeConfig, template);

        if (mounted) {
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to initialize Beefree:', err);
        if (mounted) {
          setError(err.message || 'Failed to load email editor');
          setLoading(false);
        }
      }
    }

    initializeEditor();

    return () => {
      mounted = false;
      if (beeInstanceRef.current) {
        try {
          beeInstanceRef.current = null;
        } catch (err) {
          console.error('Error cleaning up Beefree:', err);
        }
      }
    };
  }, [userId, initialContent, onSave]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Editor</h3>
        <p className="text-sm text-red-600 text-center max-w-md">{error}</p>
        <p className="text-xs text-red-500 mt-4">
          Please ensure your Beefree credentials are properly configured.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading email editor...</p>
          </div>
        </div>
      )}
      <div
        id="beefree-container"
        ref={containerRef}
        style={{
          height: '800px',
          width: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}
