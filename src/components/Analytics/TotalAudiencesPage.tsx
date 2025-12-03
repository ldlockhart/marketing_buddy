import { useEffect, useState } from 'react';
import { ArrowLeft, Users, TrendingUp, Mail, Target, PieChart as PieChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/Dashboard/StatsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AudienceData {
  id: string;
  name: string;
  description: string;
  subscriber_count: number;
  segment_type: string;
  engagement_rate: number;
  avg_order_value: number;
  created_at: string;
}

export default function TotalAudiencesPage() {
  const navigate = useNavigate();
  const [audiences, setAudiences] = useState<AudienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('audiences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setAudiences(data);
      }
    } catch (error) {
      console.error('Error loading audiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockAudiences: AudienceData[] = [
    { id: '1', name: 'High-Value Customers', description: 'Customers with LTV > $1000', subscriber_count: 1250, segment_type: 'high-value', engagement_rate: 68, avg_order_value: 245, created_at: '2024-10-15' },
    { id: '2', name: 'New Subscribers', description: 'Joined in last 30 days', subscriber_count: 3420, segment_type: 'new-subscribers', engagement_rate: 42, avg_order_value: 87, created_at: '2024-11-01' },
    { id: '3', name: 'Inactive Users', description: 'No purchase in 90+ days', subscriber_count: 2180, segment_type: 're-engagement', engagement_rate: 18, avg_order_value: 156, created_at: '2024-09-20' },
    { id: '4', name: 'Newsletter Subscribers', description: 'Opted in for newsletter', subscriber_count: 8950, segment_type: 'general', engagement_rate: 35, avg_order_value: 112, created_at: '2024-08-10' },
    { id: '5', name: 'VIP Members', description: 'Premium tier customers', subscriber_count: 456, segment_type: 'high-value', engagement_rate: 82, avg_order_value: 520, created_at: '2024-07-05' },
    { id: '6', name: 'Cart Abandoners', description: 'Left items in cart', subscriber_count: 1890, segment_type: 're-engagement', engagement_rate: 28, avg_order_value: 198, created_at: '2024-10-25' },
    { id: '7', name: 'Product Launch List', description: 'Interested in new releases', subscriber_count: 5670, segment_type: 'general', engagement_rate: 52, avg_order_value: 167, created_at: '2024-09-15' },
  ];

  const displayAudiences = audiences.length > 0 ? audiences : mockAudiences;

  const totalSubscribers = displayAudiences.reduce((sum, a) => sum + a.subscriber_count, 0);
  const avgEngagement = displayAudiences.reduce((sum, a) => sum + a.engagement_rate, 0) / displayAudiences.length;
  const avgOrderValue = displayAudiences.reduce((sum, a) => sum + (a.avg_order_value || 0) * a.subscriber_count, 0) / totalSubscribers;

  const segmentDistribution = [
    {
      name: 'High-Value',
      value: displayAudiences.filter(a => a.segment_type === 'high-value').reduce((sum, a) => sum + a.subscriber_count, 0),
      color: '#f97316'
    },
    {
      name: 'New Subscribers',
      value: displayAudiences.filter(a => a.segment_type === 'new-subscribers').reduce((sum, a) => sum + a.subscriber_count, 0),
      color: '#3b82f6'
    },
    {
      name: 'Re-engagement',
      value: displayAudiences.filter(a => a.segment_type === 're-engagement').reduce((sum, a) => sum + a.subscriber_count, 0),
      color: '#8b5cf6'
    },
    {
      name: 'General',
      value: displayAudiences.filter(a => a.segment_type === 'general').reduce((sum, a) => sum + a.subscriber_count, 0),
      color: '#10b981'
    },
  ].filter(segment => segment.value > 0);

  const engagementData = displayAudiences
    .sort((a, b) => b.engagement_rate - a.engagement_rate)
    .slice(0, 7)
    .map(a => ({
      name: a.name.substring(0, 20),
      engagement: a.engagement_rate,
      subscribers: a.subscriber_count,
    }));

  const getSegmentBadge = (type: string) => {
    switch (type) {
      case 'high-value': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High-Value</Badge>;
      case 'new-subscribers': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>;
      case 're-engagement': return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Re-engagement</Badge>;
      case 'general': return <Badge className="bg-green-100 text-green-800 border-green-200">General</Badge>;
      default: return <Badge>{type}</Badge>;
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
            <h1 className="text-3xl font-bold text-gray-900">Total Audiences</h1>
            <p className="text-gray-600 mt-1">Audience segmentation and engagement overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Segments"
          value={displayAudiences.length}
          subtitle="Active audience groups"
          icon={Target}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Subscribers"
          value={totalSubscribers.toLocaleString()}
          subtitle="Across all audiences"
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Avg Engagement"
          value={`${avgEngagement.toFixed(1)}%`}
          subtitle="Overall engagement rate"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(0)}`}
          subtitle="Per subscriber"
          icon={Mail}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Segment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {segmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement by Audience</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={12} />
              <Tooltip />
              <Bar dataKey="engagement" fill="#8b5cf6" name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Audience Segments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Audience Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Subscribers</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Engagement</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Order Value</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {displayAudiences.map((audience) => (
                <tr key={audience.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{audience.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{audience.description}</td>
                  <td className="py-3 px-4">{getSegmentBadge(audience.segment_type)}</td>
                  <td className="py-3 px-4 text-right font-medium">{audience.subscriber_count.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${audience.engagement_rate}%` }}
                        />
                      </div>
                      <span className="font-medium text-sm">{audience.engagement_rate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    ${audience.avg_order_value.toFixed(0)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(audience.created_at).toLocaleDateString()}
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
