import { useEffect, useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, ShoppingCart, Percent, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/Dashboard/StatsCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line } from 'recharts';

interface RevenueData {
  campaign_id: string;
  campaign_name: string;
  revenue: number;
  orders: number;
  avg_order_value: number;
  conversion_rate: number;
  date: string;
}

export default function TotalRevenuePage() {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id);

      const { data: analytics } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('user_id', user.id);

      if (campaigns && analytics && campaigns.length > 0) {
        const enriched = campaigns.map(c => {
          const a = analytics.find(an => an.campaign_id === c.id);
          return {
            campaign_id: c.id,
            campaign_name: c.name,
            revenue: a?.revenue_generated || 0,
            orders: a?.clicked_count || 0,
            avg_order_value: a?.clicked_count ? (a.revenue_generated / a.clicked_count) : 0,
            conversion_rate: a?.sent_count ? (a.clicked_count / a.sent_count * 100) : 0,
            date: c.created_at,
          };
        });
        setRevenueData(enriched);
      }
    } catch (error) {
      console.error('Error loading revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockRevenueData: RevenueData[] = [
    { campaign_id: '1', campaign_name: 'Summer Sale 2024', revenue: 12450, orders: 234, avg_order_value: 53.21, conversion_rate: 4.32, date: '2024-11-20' },
    { campaign_id: '2', campaign_name: 'Welcome Series - Part 1', revenue: 4820, orders: 98, avg_order_value: 49.18, conversion_rate: 3.05, date: '2024-11-18' },
    { campaign_id: '3', campaign_name: 'Product Launch', revenue: 28700, orders: 456, avg_order_value: 62.94, conversion_rate: 5.10, date: '2024-11-15' },
    { campaign_id: '4', campaign_name: 'Re-engagement', revenue: 1950, orders: 42, avg_order_value: 46.43, conversion_rate: 1.93, date: '2024-11-10' },
    { campaign_id: '5', campaign_name: 'Newsletter - November', revenue: 8900, orders: 178, avg_order_value: 50.00, conversion_rate: 2.62, date: '2024-11-01' },
    { campaign_id: '6', campaign_name: 'Cart Abandonment', revenue: 5200, orders: 112, avg_order_value: 46.43, conversion_rate: 7.72, date: '2024-11-12' },
    { campaign_id: '7', campaign_name: 'Flash Sale', revenue: 15600, orders: 298, avg_order_value: 52.35, conversion_rate: 4.87, date: '2024-11-08' },
    { campaign_id: '8', campaign_name: 'VIP Exclusive', revenue: 9800, orders: 156, avg_order_value: 62.82, conversion_rate: 8.45, date: '2024-11-05' },
  ];

  const displayData = revenueData.length > 0 ? revenueData : mockRevenueData;

  const totalRevenue = displayData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = displayData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const avgConversionRate = displayData.reduce((sum, d) => sum + d.conversion_rate, 0) / displayData.length;

  const monthlyRevenue = [
    { month: 'Jun', revenue: 42500, orders: 892, aov: 47.65 },
    { month: 'Jul', revenue: 51200, orders: 1045, aov: 49.00 },
    { month: 'Aug', revenue: 58900, orders: 1198, aov: 49.16 },
    { month: 'Sep', revenue: 64300, orders: 1287, aov: 49.96 },
    { month: 'Oct', revenue: 72100, orders: 1456, aov: 49.52 },
    { month: 'Nov', revenue: 87600, orders: 1774, aov: 49.38 },
  ];

  const revenueByChannel = [
    { channel: 'Email Campaigns', revenue: 62400, percentage: 71.2 },
    { channel: 'Automated Flows', revenue: 18900, percentage: 21.6 },
    { channel: 'Transactional', revenue: 6300, percentage: 7.2 },
  ];

  const topPerformers = [...displayData]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Total Revenue</h1>
            <p className="text-gray-600 mt-1">Revenue analytics and performance metrics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle="All campaigns combined"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          subtitle="Successful conversions"
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          subtitle="Per transaction"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Avg Conversion"
          value={`${avgConversionRate.toFixed(2)}%`}
          subtitle="Campaign conversion rate"
          icon={Percent}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Orders & AOV Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="aov" stroke="#8b5cf6" strokeWidth={2} name="AOV ($)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Channel</h3>
          <div className="space-y-6 mt-6">
            {revenueByChannel.map((channel, index) => (
              <div key={channel.channel}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{channel.channel}</span>
                  <span className="font-bold text-green-600">${channel.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        index === 0 ? 'bg-green-600' : index === 1 ? 'bg-blue-600' : 'bg-purple-600'
                      }`}
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12">{channel.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Campaigns</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="campaign_name" type="category" width={120} fontSize={12} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Campaign Name</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Orders</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Order Value</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Conversion Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item) => (
                <tr key={item.campaign_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.campaign_name}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{item.orders}</td>
                  <td className="py-3 px-4 text-right font-medium">${item.avg_order_value.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(item.conversion_rate * 10, 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-sm">{item.conversion_rate.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
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
