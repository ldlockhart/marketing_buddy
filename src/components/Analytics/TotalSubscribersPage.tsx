import { useEffect, useState } from 'react';
import { ArrowLeft, Users, TrendingUp, UserPlus, UserMinus, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/Dashboard/StatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar } from 'recharts';

interface SubscriberData {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  subscribed_at: string;
  location?: string;
  engagement_score: number;
}

export default function TotalSubscribersPage() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .order('subscribed_at', { ascending: false });

      if (data && data.length > 0) {
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockSubscribers: SubscriberData[] = Array.from({ length: 50 }, (_, i) => ({
    id: `sub-${i}`,
    email: `user${i}@example.com`,
    name: `User ${i}`,
    status: ['active', 'active', 'active', 'active', 'unsubscribed', 'bounced'][Math.floor(Math.random() * 6)] as 'active' | 'unsubscribed' | 'bounced',
    source: ['Website', 'Landing Page', 'Social Media', 'Referral', 'Import'][Math.floor(Math.random() * 5)],
    subscribed_at: new Date(2024, 10 - Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
    location: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'][Math.floor(Math.random() * 5)],
    engagement_score: Math.floor(Math.random() * 100),
  }));

  const displaySubscribers = subscribers.length > 0 ? subscribers : mockSubscribers;

  const activeSubscribers = displaySubscribers.filter(s => s.status === 'active').length;
  const unsubscribed = displaySubscribers.filter(s => s.status === 'unsubscribed').length;
  const bounced = displaySubscribers.filter(s => s.status === 'bounced').length;
  const avgEngagement = displaySubscribers.reduce((sum, s) => sum + (s.engagement_score || 0), 0) / displaySubscribers.length;

  const growthData = [
    { month: 'Jun', subscribers: 12500, newSubs: 450, unsubscribed: 120 },
    { month: 'Jul', subscribers: 14200, newSubs: 1800, unsubscribed: 100 },
    { month: 'Aug', subscribers: 16800, newSubs: 2700, unsubscribed: 110 },
    { month: 'Sep', subscribers: 18900, newSubs: 2200, unsubscribed: 90 },
    { month: 'Oct', subscribers: 21500, newSubs: 2700, unsubscribed: 100 },
    { month: 'Nov', subscribers: 24300, newSubs: 2900, unsubscribed: 110 },
  ];

  const sourceData = [
    { name: 'Website', value: displaySubscribers.filter(s => s.source === 'Website').length },
    { name: 'Landing Page', value: displaySubscribers.filter(s => s.source === 'Landing Page').length },
    { name: 'Social Media', value: displaySubscribers.filter(s => s.source === 'Social Media').length },
    { name: 'Referral', value: displaySubscribers.filter(s => s.source === 'Referral').length },
    { name: 'Import', value: displaySubscribers.filter(s => s.source === 'Import').length },
  ].filter(s => s.value > 0);

  const locationData = [
    { name: 'United States', value: displaySubscribers.filter(s => s.location === 'United States').length },
    { name: 'United Kingdom', value: displaySubscribers.filter(s => s.location === 'United Kingdom').length },
    { name: 'Canada', value: displaySubscribers.filter(s => s.location === 'Canada').length },
    { name: 'Australia', value: displaySubscribers.filter(s => s.location === 'Australia').length },
    { name: 'Germany', value: displaySubscribers.filter(s => s.location === 'Germany').length },
  ].filter(l => l.value > 0).sort((a, b) => b.value - a.value);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'unsubscribed': return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unsubscribed</Badge>;
      case 'bounced': return <Badge className="bg-red-100 text-red-800 border-red-200">Bounced</Badge>;
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
            <h1 className="text-3xl font-bold text-gray-900">Total Subscribers</h1>
            <p className="text-gray-600 mt-1">Subscriber growth and engagement metrics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Subscribers"
          value={activeSubscribers.toLocaleString()}
          subtitle={`${((activeSubscribers / displaySubscribers.length) * 100).toFixed(1)}% of total`}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="New This Month"
          value={2900}
          subtitle="Growth rate: 13.5%"
          icon={UserPlus}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Unsubscribed"
          value={unsubscribed}
          subtitle="Churn rate: 0.45%"
          icon={UserMinus}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Avg Engagement"
          value={`${avgEngagement.toFixed(0)}%`}
          subtitle="Overall health score"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: 7, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subscriber Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="subscribers" stroke="#10b981" fillOpacity={1} fill="url(#colorSubs)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newSubs" stroke="#3b82f6" strokeWidth={2} name="New Subscribers" />
              <Line type="monotone" dataKey="unsubscribed" stroke="#ef4444" strokeWidth={2} name="Unsubscribed" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Acquisition Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" name="Subscribers" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-4 mt-6">
            {locationData.map((location, index) => (
              <div key={location.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{location.name}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(location.value / displaySubscribers.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-16 text-right">{location.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Subscribers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Engagement</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {displaySubscribers.slice(0, 20).map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{subscriber.name}</td>
                  <td className="py-3 px-4">{getStatusBadge(subscriber.status)}</td>
                  <td className="py-3 px-4 text-gray-600">{subscriber.source}</td>
                  <td className="py-3 px-4 text-gray-600">{subscriber.location}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${subscriber.engagement_score}%` }}
                        />
                      </div>
                      <span className="font-medium text-sm">{subscriber.engagement_score}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
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
