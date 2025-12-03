import { useEffect, useState } from 'react';
import { Plus, Send, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { supabase, Campaign, Audience } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';
import CampaignBuilder from './CampaignBuilder';

interface CampaignsProps {
  onLaunchEditor?: (campaignId: string, campaignName: string, emailContent: any) => void;
}

export default function Campaigns({ onLaunchEditor }: CampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    loadCampaigns();
    loadAudiences();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAudiences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('audiences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setAudiences(data || []);
    } catch (error) {
      console.error('Error loading audiences:', error);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowBuilder(true);
  };

  const handleCloseBuilder = () => {
    setShowBuilder(false);
    setEditingCampaign(null);
    loadCampaigns();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceName = (audienceId: string | null) => {
    if (!audienceId) return 'No audience';
    const audience = audiences.find(a => a.id === audienceId);
    return audience?.name || 'Unknown';
  };

  if (showBuilder) {
    return (
      <CampaignBuilder
        campaign={editingCampaign}
        audiences={audiences}
        onClose={handleCloseBuilder}
        onLaunchEditor={onLaunchEditor}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BuddyMascot mood="thinking" message="Loading your campaigns..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Campaigns</h2>
          <p className="text-gray-600 mt-1">Create and manage your email campaigns</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Campaign</span>
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BuddyMascot mood="happy" message="Let's create your first campaign!" />
          <h3 className="text-xl font-semibold text-gray-800 mt-6">No campaigns yet</h3>
          <p className="text-gray-600 mt-2">Get started by creating your first email campaign</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{campaign.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{campaign.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Audience: {getAudienceName(campaign.audience_id)}</span>
                  </div>
                  {campaign.scheduled_at && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled: {new Date(campaign.scheduled_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {campaign.sent_at && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Sent: {new Date(campaign.sent_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleEditCampaign(campaign)}
                  className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
