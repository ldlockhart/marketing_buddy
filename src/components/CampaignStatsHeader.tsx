import { useState, useEffect } from 'react';
import { Users, Eye, DollarSign, TrendingUp, Target, Award, Zap } from 'lucide-react';
import { supabase, Audience } from '../lib/supabase';

export type CampaignType = 'high-value' | 'new-subscribers' | 're-engagement' | 'general';

interface CampaignStats {
  recipientCount: number;
  expectedOpenRate: number;
  projectedRevenue: number;
  confidence: 'high' | 'medium' | 'low';
  audienceName: string;
  estimatedClicks: number;
  estimatedConversions: number;
}

interface CampaignStatsHeaderProps {
  campaignId: string;
  audienceId?: string;
  campaignType?: CampaignType;
}

const campaignTypeConfig = {
  'high-value': {
    name: 'High Value Customers',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'from-amber-50 to-yellow-50',
    textColor: 'text-amber-700',
    openRateBoost: 1.15,
    conversionBoost: 1.25,
    description: 'Premium customers with high lifetime value',
  },
  'new-subscribers': {
    name: 'New Subscribers',
    icon: Zap,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-50',
    textColor: 'text-green-700',
    openRateBoost: 1.30,
    conversionBoost: 1.10,
    description: 'Recently subscribed and highly engaged',
  },
  're-engagement': {
    name: 'Re-engagement',
    icon: Target,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50',
    textColor: 'text-blue-700',
    openRateBoost: 0.85,
    conversionBoost: 0.90,
    description: 'Inactive users who need attention',
  },
  'general': {
    name: 'General Campaign',
    icon: Users,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'from-gray-50 to-slate-50',
    textColor: 'text-gray-700',
    openRateBoost: 1.0,
    conversionBoost: 1.0,
    description: 'Standard campaign for all subscribers',
  },
};

export default function CampaignStatsHeader({ campaignId, audienceId, campaignType = 'general' }: CampaignStatsHeaderProps) {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);

  const typeConfig = campaignTypeConfig[campaignType];
  const Icon = typeConfig.icon;

  useEffect(() => {
    if (audienceId) {
      fetchCampaignStats();
    } else {
      setLoading(false);
    }
  }, [audienceId, campaignId, campaignType]);

  const fetchCampaignStats = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !audienceId) return;

      const { data: audience } = await supabase
        .from('audiences')
        .select('*')
        .eq('id', audienceId)
        .maybeSingle();

      if (!audience) return;

      const { data: historicalCampaigns } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('user_id', user.id)
        .limit(10);

      let baseOpenRate = 22;
      let baseClickRate = 2.8;
      let baseConversionRate = 3.5;
      let avgOrderValue = 75;
      let confidence: 'high' | 'medium' | 'low' = 'medium';

      if (historicalCampaigns && historicalCampaigns.length > 0) {
        const totalSent = historicalCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
        const totalOpened = historicalCampaigns.reduce((sum, c) => sum + (c.opened_count || 0), 0);
        const totalClicked = historicalCampaigns.reduce((sum, c) => sum + (c.clicked_count || 0), 0);
        const totalRevenue = historicalCampaigns.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0);

        if (totalSent > 0) {
          baseOpenRate = (totalOpened / totalSent) * 100;
          baseClickRate = (totalClicked / totalSent) * 100;

          if (totalClicked > 0) {
            baseConversionRate = ((totalRevenue / avgOrderValue) / totalClicked) * 100;
          }

          if (historicalCampaigns.length >= 5 && audience.subscriber_count >= 500) {
            confidence = 'high';
          } else if (historicalCampaigns.length >= 2 && audience.subscriber_count >= 100) {
            confidence = 'medium';
          } else {
            confidence = 'low';
          }
        }
      }

      const adjustedOpenRate = Math.min(baseOpenRate * typeConfig.openRateBoost, 50);
      const adjustedConversionRate = baseConversionRate * typeConfig.conversionBoost;

      const recipientCount = audience.subscriber_count;
      const estimatedOpens = Math.round(recipientCount * (adjustedOpenRate / 100));
      const estimatedClicks = Math.round(recipientCount * (baseClickRate / 100));
      const estimatedConversions = Math.round(estimatedClicks * (adjustedConversionRate / 100));
      const projectedRevenue = estimatedConversions * avgOrderValue;

      setStats({
        recipientCount,
        expectedOpenRate: adjustedOpenRate,
        projectedRevenue,
        confidence,
        audienceName: audience.name,
        estimatedClicks,
        estimatedConversions,
      });
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r ${typeConfig.bgColor} border-b-2 border-gray-200 px-6 py-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !audienceId) {
    return (
      <div className={`bg-gradient-to-r ${typeConfig.bgColor} border-b-2 border-gray-200 px-6 py-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${typeConfig.textColor}`}>{typeConfig.name}</h2>
              <p className="text-sm text-gray-600">Select an audience to see campaign stats</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getConfidenceBadge = () => {
    const badges = {
      high: { text: 'High Confidence', color: 'bg-green-100 text-green-700 border-green-300' },
      medium: { text: 'Medium Confidence', color: 'bg-amber-100 text-amber-700 border-amber-300' },
      low: { text: 'Low Confidence', color: 'bg-red-100 text-red-700 border-red-300' },
    };
    const badge = badges[stats.confidence];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className={`bg-gradient-to-r ${typeConfig.bgColor} border-b-2 border-gray-200 px-6 py-4 shadow-sm`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${typeConfig.textColor}`}>{typeConfig.name}</h2>
              <p className="text-sm text-gray-600">{typeConfig.description}</p>
            </div>
          </div>
          {getConfidenceBadge()}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs font-medium text-gray-600">Recipients</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.recipientCount.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.audienceName}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-gray-600">Open Rate</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.expectedOpenRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">~{Math.round(stats.recipientCount * (stats.expectedOpenRate / 100)).toLocaleString()} opens</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-gray-600">Clicks</p>
            </div>
            <p className="text-2xl font-bold text-purple-700">{stats.estimatedClicks.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Estimated clicks</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs font-medium text-gray-600">Conversions</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.estimatedConversions}</p>
            <p className="text-xs text-gray-500 mt-1">Expected sales</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xs font-medium text-gray-600">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-amber-700">${stats.projectedRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Projected 24h</p>
          </div>
        </div>

        {campaignType !== 'general' && (
          <div className="mt-3 bg-white/60 rounded-lg px-4 py-2 border border-gray-200">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Campaign Type Boost:</span> This audience segment has been optimized with{' '}
              {campaignType === 'high-value' && 'higher conversion rates based on customer value'}
              {campaignType === 'new-subscribers' && 'increased open rates for fresh, engaged subscribers'}
              {campaignType === 're-engagement' && 'adjusted expectations for inactive users'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
