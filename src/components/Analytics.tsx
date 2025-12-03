import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Mail, Eye, MousePointer, DollarSign, Target } from 'lucide-react';
import { supabase, Campaign, CampaignAnalytics } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';

interface CampaignWithAnalytics extends Campaign {
  analytics?: CampaignAnalytics;
}

export default function Analytics() {
  const [campaigns, setCampaigns] = useState<CampaignWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignWithAnalytics | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [campaignsResult, analyticsResult] = await Promise.all([
        supabase.from('campaigns').select('*').eq('user_id', user.id).eq('status', 'sent'),
        supabase.from('campaign_analytics').select('*').eq('user_id', user.id),
      ]);

      const campaigns = campaignsResult.data || [];
      const analytics = analyticsResult.data || [];

      const campaignsWithAnalytics = campaigns.map(campaign => ({
        ...campaign,
        analytics: analytics.find(a => a.campaign_id === campaign.id),
      }));

      setCampaigns(campaignsWithAnalytics);
      if (campaignsWithAnalytics.length > 0) {
        setSelectedCampaign(campaignsWithAnalytics[0]);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRate = (numerator: number, denominator: number): string => {
    if (denominator === 0) return '0.0';
    return ((numerator / denominator) * 100).toFixed(1);
  };

  const getOverallStats = () => {
    const totalSent = campaigns.reduce((sum, c) => sum + (c.analytics?.sent_count || 0), 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.analytics?.opened_count || 0), 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + (c.analytics?.clicked_count || 0), 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + Number(c.analytics?.revenue_generated || 0), 0);

    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalRevenue,
      openRate: calculateRate(totalOpened, totalSent),
      clickRate: calculateRate(totalClicked, totalSent),
    };
  };

  const overallStats = getOverallStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BuddyMascot mood="thinking" message="Analyzing your campaign performance..." />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
          <p className="text-gray-600 mt-1">Track campaign performance and metrics</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BuddyMascot mood="happy" message="Send your first campaign to see analytics!" />
          <h3 className="text-xl font-semibold text-gray-800 mt-6">No analytics yet</h3>
          <p className="text-gray-600 mt-2">Analytics will appear here once you send campaigns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
        <p className="text-gray-600 mt-1">Track campaign performance and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Sent</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{overallStats.totalSent}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Open Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{overallStats.openRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Click Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{overallStats.clickRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">${overallStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Campaign List</h3>
          <div className="space-y-2">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedCampaign?.id === campaign.id
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <p className="font-medium">{campaign.name}</p>
                <p className={`text-sm ${selectedCampaign?.id === campaign.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {new Date(campaign.sent_at!).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {selectedCampaign && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedCampaign.name}</h3>
              <p className="text-gray-600 mb-6">{selectedCampaign.subject}</p>

              {selectedCampaign.analytics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">Sent</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{selectedCampaign.analytics.sent_count}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{selectedCampaign.analytics.delivered_count}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">Opens</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{selectedCampaign.analytics.opened_count}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {calculateRate(selectedCampaign.analytics.opened_count, selectedCampaign.analytics.sent_count)}% rate
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MousePointer className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">Clicks</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{selectedCampaign.analytics.clicked_count}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {calculateRate(selectedCampaign.analytics.clicked_count, selectedCampaign.analytics.sent_count)}% rate
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">Bounces</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{selectedCampaign.analytics.bounced_count}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      ${Number(selectedCampaign.analytics.revenue_generated).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No analytics data available for this campaign</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BuddyMascot size="small" mood="celebrating" />
                <h3 className="text-lg font-bold text-gray-800">Performance Insights</h3>
              </div>
              <div className="space-y-3 text-sm">
                {selectedCampaign.analytics && (
                  <>
                    {Number(calculateRate(selectedCampaign.analytics.opened_count, selectedCampaign.analytics.sent_count)) > 20 ? (
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Great open rate! Your subject line was effective.</p>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <TrendingDown className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Consider A/B testing different subject lines to improve open rates.</p>
                      </div>
                    )}

                    {Number(calculateRate(selectedCampaign.analytics.clicked_count, selectedCampaign.analytics.sent_count)) > 2.5 ? (
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Excellent click rate! Your content resonated with subscribers.</p>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <TrendingDown className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">Try including more compelling calls-to-action to boost clicks.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
