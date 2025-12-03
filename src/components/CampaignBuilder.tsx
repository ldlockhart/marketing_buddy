import { useState, useEffect } from 'react';
import { X, Save, Send, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { supabase, Campaign, Audience } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';
import BeefreeEditor from './BeefreeEditor';
import RevenuePrediction from './RevenuePrediction';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { emailTemplates, EmailTemplate } from '../lib/emailTemplates';
import { convertHtmlToBeefreeJson } from '../lib/beefreeApi';

interface CampaignBuilderProps {
  campaign: Campaign | null;
  audiences: Audience[];
  onClose: () => void;
  onLaunchEditor?: (campaignId: string, campaignName: string, emailContent: any, audienceId?: string, campaignType?: 'high-value' | 'new-subscribers' | 're-engagement' | 'general') => void;
}

export default function CampaignBuilder({ campaign, audiences, onClose, onLaunchEditor }: CampaignBuilderProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preview_text: '',
    audience_id: '',
    status: 'draft' as const,
    email_html: '',
    campaign_type: 'general' as 'high-value' | 'new-subscribers' | 're-engagement' | 'general',
  });
  const [saving, setSaving] = useState(false);
  const [showBeefreeEditor, setShowBeefreeEditor] = useState(false);
  const [emailJson, setEmailJson] = useState<any>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [previousAudienceId, setPreviousAudienceId] = useState('');
  const [predictionKey, setPredictionKey] = useState(0);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        subject: campaign.subject,
        preview_text: campaign.preview_text,
        audience_id: campaign.audience_id || '',
        status: campaign.status,
        email_html: campaign.email_html,
        campaign_type: 'general',
      });

      try {
        if (campaign.email_html && campaign.email_html.startsWith('{')) {
          setEmailJson(JSON.parse(campaign.email_html));
        }
      } catch (err) {
        console.log('Campaign HTML is not JSON format');
      }
    }
  }, [campaign]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'audience_id' && value !== previousAudienceId) {
      setPreviousAudienceId(value);
      setPredictionKey(prev => prev + 1);
    }
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (campaign) {
        const updateData = {
          ...formData,
          audience_id: formData.audience_id || null,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('campaigns')
          .update(updateData)
          .eq('id', campaign.id);

        if (error) throw error;
      } else {
        const insertData = {
          ...formData,
          audience_id: formData.audience_id || null,
          user_id: user.id,
        };

        const { data, error } = await supabase
          .from('campaigns')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBeefreeEditorSave = (html: string, json: string) => {
    setFormData({ ...formData, email_html: json });
    setEmailJson(JSON.parse(json));
    setShowBeefreeEditor(false);
  };

  const handleLaunchEditor = async () => {
    if (!formData.name) {
      alert('Please enter a campaign name first');
      return;
    }

    let currentCampaignId = campaign?.id;

    if (!currentCampaignId) {
      setSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('You must be logged in to create a campaign');
          setSaving(false);
          return;
        }

        const campaignData = {
          ...formData,
          audience_id: formData.audience_id || null,
          user_id: user.id,
        };

        const { data, error } = await supabase
          .from('campaigns')
          .insert(campaignData)
          .select()
          .single();

        if (error) {
          console.error('Error creating campaign:', error);
          alert(`Failed to create campaign: ${error.message}`);
          setSaving(false);
          return;
        }
        currentCampaignId = data.id;
      } catch (error: any) {
        console.error('Error creating campaign:', error);
        alert(`Failed to create campaign: ${error?.message || 'Unknown error'}`);
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }

    if (onLaunchEditor && currentCampaignId) {
      onLaunchEditor(currentCampaignId, formData.name, emailJson, formData.audience_id, formData.campaign_type);
    }
  };

  const handleLoadTemplate = async (template: EmailTemplate) => {
    setLoadingTemplate(true);
    setShowTemplateSelector(false);

    try {
      const beefreeJson = await convertHtmlToBeefreeJson(template.html);
      setEmailJson(beefreeJson);
      setFormData({ ...formData, email_html: JSON.stringify(beefreeJson) });

      if (!campaign?.id) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && formData.name) {
          const templateData = {
            ...formData,
            audience_id: formData.audience_id || null,
            email_html: JSON.stringify(beefreeJson),
            user_id: user.id,
          };

          const { data, error } = await supabase
            .from('campaigns')
            .insert(templateData)
            .select()
            .single();

          if (!error && data && onLaunchEditor) {
            onLaunchEditor(data.id, formData.name, beefreeJson);
          }
        }
      } else if (onLaunchEditor) {
        onLaunchEditor(campaign.id, formData.name, beefreeJson);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Failed to load template');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const selectedAudience = audiences.find(a => a.id === formData.audience_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {campaign ? 'Edit Campaign' : 'Create Campaign'}
            </h2>
            <p className="text-gray-600 mt-1">Design your email campaign</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={saving || !formData.name}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">Save Campaign</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Marketing Campaign"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Type
                </label>
                <select
                  name="campaign_type"
                  value={formData.campaign_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="general">General Campaign</option>
                  <option value="high-value">High Value Customers</option>
                  <option value="new-subscribers">New Subscribers</option>
                  <option value="re-engagement">Re-engagement</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Campaign type affects prediction accuracy and expected performance
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Email Content</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLaunchEditor}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Email Editor</span>
                </button>
                <button
                  onClick={() => setShowBeefreeEditor(!showBeefreeEditor)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:shadow-md transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{showBeefreeEditor ? 'Hide Quick Editor' : 'Quick Editor'}</span>
                </button>
              </div>
            </div>

            {showTemplateSelector && (
              <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Choose a Template</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleLoadTemplate(template)}
                      disabled={loadingTemplate || !formData.name}
                      className="text-left p-4 bg-white rounded-lg border-2 border-transparent hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <h5 className="font-semibold text-gray-800 mb-1">{template.name}</h5>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </button>
                  ))}
                </div>
                {!formData.name && (
                  <p className="text-sm text-orange-600 mt-3">Please enter a campaign name first</p>
                )}
              </div>
            )}

            {showBeefreeEditor ? (
              <BeefreeEditor
                onSave={handleBeefreeEditorSave}
                initialContent={emailJson}
                userId={formData.name || 'marketing-buddy-user'}
              />
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  {formData.email_html ? 'Email design saved!' : 'Click "Open Visual Editor" to design your email'}
                </p>
                <textarea
                  name="email_html"
                  value={formData.email_html}
                  onChange={handleChange}
                  placeholder="Email JSON will be stored here (use the visual editor above)"
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent font-mono text-sm bg-gray-50"
                  readOnly
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Campaign Buddy</h3>
              <BuddyMascot size="small" mood="happy" />
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p>I'm here to help you create an amazing campaign!</p>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-medium text-orange-800">Tips:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Keep subject lines under 50 characters</li>
                  <li>Personalize when possible</li>
                  <li>Include a clear call-to-action</li>
                  <li>Test on mobile devices</li>
                </ul>
              </div>
            </div>
          </div>

          {selectedAudience && (
            <Card padding="lg" gradient className="border border-green-100">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">Audience Stats</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Selected Audience</p>
                  <p className="text-lg font-bold text-gray-800">{selectedAudience.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subscribers</p>
                  <p className="text-2xl font-bold text-green-600">{selectedAudience.subscriber_count}</p>
                </div>
                {selectedAudience.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-700">{selectedAudience.description}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {formData.audience_id && (
            <RevenuePrediction
              key={predictionKey}
              audienceId={formData.audience_id}
              audiences={audiences}
              campaignName={formData.name}
              campaignSubject={formData.subject}
            />
          )}
        </div>
      </div>
    </div>
  );
}
