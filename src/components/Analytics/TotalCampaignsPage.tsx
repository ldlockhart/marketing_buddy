import { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Send, Eye, MousePointer, DollarSign, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/Dashboard/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface CampaignData {
  id: string;
  name: string;
  subject: string;
  status: string;
  created_at: string;
  sent_count?: number;
  opened_count?: number;
  clicked_count?: number;
  revenue?: number;
}

export default function TotalCampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent'>('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: analyticsData } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('user_id', user.id);

      const enrichedCampaigns = (campaignsData || []).map(campaign => {
        const analytics = analyticsData?.find(a => a.campaign_id === campaign.id);
        return {
          ...campaign,
          sent_count: analytics?.sent_count || 0,
          opened_count: analytics?.opened_count || 0,
          clicked_count: analytics?.clicked_count || 0,
          revenue: analytics?.revenue_generated || 0,
        };
      });

      setCampaigns(enrichedCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCampaigns: CampaignData[] = [
    { id: '1', name: 'Summer Sale 2024', subject: 'Save 30% on Summer Collection', status: 'sent', created_at: '2024-11-20', sent_count: 5420, opened_count: 2167, clicked_count: 542, revenue: 12450 },
    { id: '2', name: 'Welcome Series - Part 1', subject: 'Welcome to Our Community!', status: 'sent', created_at: '2024-11-18', sent_count: 3210, opened_count: 1605, clicked_count: 385, revenue: 4820 },
    { id: '3', name: 'Product Launch Announcement', subject: 'Introducing Our Latest Innovation', status: 'sent', created_at: '2024-11-15', sent_count: 8950, opened_count: 3580, clicked_count: 895, revenue: 28700 },
    { id: '4', name: 'Black Friday Preview', subject: 'Early Access to Black Friday Deals', status: 'scheduled', created_at: '2024-11-25', sent_count: 0, opened_count: 0, clicked_count: 0, revenue: 0 },
    { id: '5', name: 'Customer Appreciation', subject: 'Thank You for Being Awesome', status: 'draft', created_at: '2024-11-22', sent_count: 0, opened_count: 0, clicked_count: 0, revenue: 0 },
    { id: '6', name: 'Re-engagement Campaign', subject: 'We Miss You! Come Back', status: 'sent', created_at: '2024-11-10', sent_count: 2180, opened_count: 654, clicked_count: 131, revenue: 1950 },
    { id: '7', name: 'Newsletter - November', subject: 'Your Monthly Update is Here', status: 'sent', created_at: '2024-11-01', sent_count: 6780, opened_count: 2712, clicked_count: 542, revenue: 8900 },
    { id: '8', name: 'Cart Abandonment', subject: 'You Left Something Behind', status: 'sent', created_at: '2024-11-12', sent_count: 1450, opened_count: 725, clicked_count: 218, revenue: 5200 },
  ];

  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;
  const filteredCampaigns = filter === 'all' ? displayCampaigns : displayCampaigns.filter(c => c.status === filter);

  const totalSent = filteredCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
  const totalOpened = filteredCampaigns.reduce((sum, c) => sum + (c.opened_count || 0), 0);
  const totalClicked = filteredCampaigns.reduce((sum, c) => sum + (c.clicked_count || 0), 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);

  const chartData = filteredCampaigns
    .filter(c => c.status === 'sent')
    .slice(0, 7)
    .reverse()
    .map(c => ({
      name: c.name.substring(0, 20),
      sent: c.sent_count,
      opened: c.opened_count,
      clicked: c.clicked_count,
    }));

  const performanceData = filteredCampaigns
    .filter(c => c.status === 'sent')
    .slice(0, 7)
    .reverse()
    .map(c => ({
      name: c.name.substring(0, 20),
      openRate: c.sent_count ? ((c.opened_count || 0) / c.sent_count * 100) : 0,
      clickRate: c.sent_count ? ((c.clicked_count || 0) / c.sent_count * 100) : 0,
    }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': return <Badge className="bg-green-100 text-green-800 border-green-200">Sent</Badge>;
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
      case 'draft': return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Total Campaigns</h1>
            <p className="text-gray-600 mt-1">Comprehensive campaign performance overview</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'sent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('sent')}
          >
            Sent
          </Button>
          <Button
            variant={filter === 'scheduled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('scheduled')}
          >
            Scheduled
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Emails Sent"
          value={totalSent.toLocaleString()}
          icon={Send}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Opens"
          value={totalOpened.toLocaleString()}
          subtitle={`${totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0}% open rate`}
          icon={Eye}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Clicks"
          value={totalClicked.toLocaleString()}
          subtitle={`${totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0}% click rate`}
          icon={MousePointer}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle="From all campaigns"
          icon={DollarSign}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
              <Bar dataKey="opened" fill="#10b981" name="Opened" />
              <Bar dataKey="clicked" fill="#8b5cf6" name="Clicked" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="openRate" stroke="#10b981" strokeWidth={2} name="Open Rate %" />
              <Line type="monotone" dataKey="clickRate" stroke="#8b5cf6" strokeWidth={2} name="Click Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Campaign Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Sent</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Opens</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{campaign.subject}</td>
                  <td className="py-3 px-4">{getStatusBadge(campaign.status)}</td>
                  <td className="py-3 px-4 text-right font-medium">{(campaign.sent_count || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-medium">{(campaign.opened_count || 0).toLocaleString()}</span>
                      {campaign.sent_count && campaign.sent_count > 0 && (
                        <span className="text-xs text-gray-500">
                          {((campaign.opened_count || 0) / campaign.sent_count * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-medium">{(campaign.clicked_count || 0).toLocaleString()}</span>
                      {campaign.sent_count && campaign.sent_count > 0 && (
                        <span className="text-xs text-gray-500">
                          {((campaign.clicked_count || 0) / campaign.sent_count * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    ${(campaign.revenue || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
