import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Users, TrendingUp, DollarSign, Send, Eye, MousePointer } from 'lucide-react';
import { supabase, Campaign, CampaignAnalytics } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';
import StatsCard from './ui/StatsCard';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from '@/components/ui/button';
import RecommendationEngine from './Dashboard/RecommendationEngine';
import SettingsPopup from './Dashboard/SettingsPopup';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalAudiences: number;
  totalSubscribers: number;
  totalRevenue: number;
  avgOpenRate: number;
  avgClickRate: number;
  recentCampaigns: (Campaign & { analytics?: CampaignAnalytics })[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalAudiences: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
    recentCampaigns: [],
  });
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('PROD-101');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [campaignsResult, audiencesResult, subscribersResult, analyticsResult] = await Promise.all([
        supabase.from('campaigns').select('*').eq('user_id', user.id),
        supabase.from('audiences').select('*').eq('user_id', user.id),
        supabase.from('subscribers').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('campaign_analytics').select('*').eq('user_id', user.id),
      ]);

      const campaigns = campaignsResult.data || [];
      const audiences = audiencesResult.data || [];
      const subscribers = subscribersResult.data || [];
      const analytics = analyticsResult.data || [];

      const totalRevenue = analytics.reduce((sum, a) => sum + Number(a.revenue_generated || 0), 0);
      const totalSent = analytics.reduce((sum, a) => sum + (a.sent_count || 0), 0);
      const totalOpened = analytics.reduce((sum, a) => sum + (a.opened_count || 0), 0);
      const totalClicked = analytics.reduce((sum, a) => sum + (a.clicked_count || 0), 0);

      const recentCampaigns = campaigns
        .slice(0, 5)
        .map(campaign => ({
          ...campaign,
          analytics: analytics.find(a => a.campaign_id === campaign.id)
        }));

      const hasRealData = campaigns.length > 0 || audiences.length > 0 || subscribers.length > 0;

      if (hasRealData) {
        setStats({
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter(c => c.status === 'sent' || c.status === 'scheduled').length,
          totalAudiences: audiences.length,
          totalSubscribers: subscribers.length,
          totalRevenue,
          avgOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
          avgClickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
          recentCampaigns,
        });
      } else {
        setStats({
          totalCampaigns: 27990,
          activeCampaigns: 6,
          totalAudiences: 24816,
          totalSubscribers: 24300,
          totalRevenue: 87620,
          avgOpenRate: 39.5,
          avgClickRate: 4.27,
          recentCampaigns: [],
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BuddyMascot mood="thinking" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's your marketing overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <BuddyMascot mood="excited" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => navigate('/analytics/total-campaigns')} className="cursor-pointer">
          <StatsCard
            title="Total Campaigns"
            value={stats.totalCampaigns.toLocaleString()}
            subtitle="Total emails sent"
            icon={<Mail />}
            gradient="from-primary-500 to-secondary-500"
            iconBgColor="bg-primary-50"
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div onClick={() => navigate('/analytics/total-audiences')} className="cursor-pointer">
          <StatsCard
            title="Total Audiences"
            value={stats.totalAudiences.toLocaleString()}
            subtitle="Across all segments"
            icon={<Users />}
            gradient="from-secondary-500 to-accent-500"
            iconBgColor="bg-secondary-50"
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div onClick={() => navigate('/analytics/total-subscribers')} className="cursor-pointer">
          <StatsCard
            title="Total Subscribers"
            value={stats.totalSubscribers.toLocaleString()}
            subtitle="Active subscribers"
            icon={<TrendingUp />}
            gradient="from-green-500 to-emerald-600"
            iconBgColor="bg-green-50"
            trend={{ value: 15, isPositive: true }}
          />
        </div>
        <div onClick={() => navigate('/analytics/total-revenue')} className="cursor-pointer">
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            subtitle="All campaigns combined"
            icon={<DollarSign />}
            gradient="from-accent-500 to-amber-600"
            iconBgColor="bg-accent-50"
            trend={{ value: 24, isPositive: true }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Performance Metrics</h3>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                    <p className="text-3xl font-bold text-green-700 mt-1">{stats.avgOpenRate.toFixed(1)}%</p>
                  </div>
                </div>
                {stats.avgOpenRate > 20 && (
                  <Badge variant="success">Excellent!</Badge>
                )}
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <MousePointer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
                    <p className="text-3xl font-bold text-blue-700 mt-1">{stats.avgClickRate.toFixed(1)}%</p>
                  </div>
                </div>
                {stats.avgClickRate > 2.5 && (
                  <Badge variant="success">Great!</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Campaigns</h3>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            {stats.recentCampaigns.length > 0 ? (
              stats.recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 bg-gradient-to-br from-gray-50 to-neutral-50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          variant={
                            campaign.status === 'sent' ? 'success' :
                            campaign.status === 'scheduled' ? 'primary' :
                            campaign.status === 'draft' ? 'neutral' : 'warning'
                          }
                        >
                          {campaign.status}
                        </Badge>
                        <p className="font-semibold text-gray-800">{campaign.name}</p>
                      </div>
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                    </div>
                    {campaign.analytics && (
                      <div className="flex items-center space-x-3 ml-4">
                        <div className="flex items-center space-x-1 text-sm">
                          <Send className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{campaign.analytics.sent_count}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{campaign.analytics.opened_count}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BuddyMascot mood="happy" message="No campaigns yet. Let's create your first one!" size="small" />
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Recommendations</h3>
          <p className="text-gray-600">Discover cross-sell opportunities with our recommendation engine</p>
        </div>
        <RecommendationEngine
          selectedProduct={selectedProduct}
          onRecommendationSelect={(rec) => {
            console.log('Selected recommendation:', rec);
          }}
          onCreateCampaign={() => navigate('/campaigns')}
        />
      </div>

      <SettingsPopup
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={(settings) => {
          console.log('Settings saved:', settings);
        }}
      />
    </div>
  );
}
