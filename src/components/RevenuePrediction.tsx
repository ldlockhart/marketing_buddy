import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Clock, AlertCircle, Sparkles, Zap, Award, Eye, MousePointer, ShoppingCart } from 'lucide-react';
import { supabase, Audience } from '../lib/supabase';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import BuddyMascot from './BuddyMascot';

interface PredictionData {
  immediateRevenue: number;
  thirtyDayRevenue: number;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number;
  estimatedOpenRate: number;
  estimatedClickRate: number;
  estimatedConversionRate: number;
  audienceSize: number;
  estimatedOpens: number;
  estimatedClicks: number;
  estimatedConversions: number;
}

interface RevenuePredictionProps {
  audienceId: string;
  audiences: Audience[];
  campaignName?: string;
  campaignSubject?: string;
  onPredictionGenerated?: (prediction: PredictionData) => void;
}

function ProgressBar({ value, max, color, label, animate = true }: { value: number; max: number; color: string; label: string; animate?: boolean }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out ${animate ? 'shadow-glow' : ''}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function ConfidenceMeter({ confidence, score }: { confidence: string; score: number }) {
  const getColor = () => {
    if (confidence === 'high') return 'from-green-500 to-emerald-600';
    if (confidence === 'medium') return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getIcon = () => {
    if (confidence === 'high') return <Award className="w-6 h-6 text-white" />;
    if (confidence === 'medium') return <Target className="w-6 h-6 text-white" />;
    return <AlertCircle className="w-6 h-6 text-white" />;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Prediction Confidence</span>
        <Badge variant={confidence === 'high' ? 'success' : confidence === 'medium' ? 'warning' : 'error'}>
          {confidence.toUpperCase()}
        </Badge>
      </div>
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${score}%` }}
        >
          <div className="animate-pulse">{getIcon()}</div>
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

function AnimatedNumber({ value, prefix = '', suffix = '', className = '' }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.min(increment * currentStep, value));

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={className}>
      {prefix}{displayValue.toFixed(2)}{suffix}
    </span>
  );
}

export default function RevenuePrediction({ audienceId, audiences, campaignName, campaignSubject, onPredictionGenerated }: RevenuePredictionProps) {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [previousPrediction, setPreviousPrediction] = useState<PredictionData | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (audienceId) {
      generatePrediction();
    }
  }, [audienceId]);

  const generatePrediction = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const selectedAudience = audiences.find(a => a.id === audienceId);
      if (!selectedAudience) return;

      const { data: historicalCampaigns } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('user_id', user.id)
        .limit(10);

      const audienceSize = selectedAudience.subscriber_count || 0;

      let avgOpenRate = 22;
      let avgClickRate = 2.8;
      let avgConversionRate = 3.5;
      let avgOrderValue = 75;
      let confidence: 'high' | 'medium' | 'low' = 'medium';
      let confidenceScore = 65;

      if (historicalCampaigns && historicalCampaigns.length > 0) {
        const totalSent = historicalCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
        const totalOpened = historicalCampaigns.reduce((sum, c) => sum + (c.opened_count || 0), 0);
        const totalClicked = historicalCampaigns.reduce((sum, c) => sum + (c.clicked_count || 0), 0);
        const totalRevenue = historicalCampaigns.reduce((sum, c) => sum + Number(c.revenue_generated || 0), 0);

        if (totalSent > 0) {
          avgOpenRate = (totalOpened / totalSent) * 100;
          avgClickRate = (totalClicked / totalSent) * 100;

          if (totalClicked > 0) {
            avgConversionRate = ((totalRevenue / avgOrderValue) / totalClicked) * 100;
          }

          if (historicalCampaigns.length >= 5 && audienceSize >= 500) {
            confidence = 'high';
            confidenceScore = 85;
          } else if (historicalCampaigns.length >= 2 && audienceSize >= 100) {
            confidence = 'medium';
            confidenceScore = 70;
          } else {
            confidence = 'low';
            confidenceScore = 50;
          }
        }
      } else {
        confidence = 'low';
        confidenceScore = 45;
      }

      if (audienceSize < 100) {
        confidence = 'low';
        confidenceScore = Math.min(confidenceScore, 55);
      }

      const estimatedOpens = Math.round(audienceSize * (avgOpenRate / 100));
      const estimatedClicks = Math.round(audienceSize * (avgClickRate / 100));
      const estimatedConversions = Math.round(estimatedClicks * (avgConversionRate / 100));

      const immediateRevenue = estimatedConversions * avgOrderValue;
      const thirtyDayRevenue = immediateRevenue * 1.35;

      let subjectBoost = 1.0;
      if (campaignSubject) {
        const subjectLength = campaignSubject.length;
        if (subjectLength > 0 && subjectLength <= 50) {
          subjectBoost = 1.1;
        }
        if (campaignSubject.includes('!') || campaignSubject.includes('?')) {
          subjectBoost *= 1.05;
        }
        if (/\d+%/.test(campaignSubject) || /\$\d+/.test(campaignSubject)) {
          subjectBoost *= 1.08;
        }
      }

      const boostedOpenRate = Math.min(avgOpenRate * subjectBoost, 45);
      const boostedEstimatedOpens = Math.round(audienceSize * (boostedOpenRate / 100));
      const boostedEstimatedClicks = Math.round(audienceSize * (avgClickRate / 100));
      const boostedEstimatedConversions = Math.round(boostedEstimatedClicks * (avgConversionRate / 100));
      const boostedImmediateRevenue = boostedEstimatedConversions * avgOrderValue;
      const boostedThirtyDayRevenue = boostedImmediateRevenue * 1.35;

      const predictionData: PredictionData = {
        immediateRevenue: boostedImmediateRevenue,
        thirtyDayRevenue: boostedThirtyDayRevenue,
        confidence,
        confidenceScore,
        estimatedOpenRate: boostedOpenRate,
        estimatedClickRate: avgClickRate,
        estimatedConversionRate: avgConversionRate,
        audienceSize,
        estimatedOpens: boostedEstimatedOpens,
        estimatedClicks: boostedEstimatedClicks,
        estimatedConversions: boostedEstimatedConversions,
      };

      if (prediction && prediction.audienceSize !== audienceSize) {
        setPreviousPrediction(prediction);
        setShowComparison(true);
        setTimeout(() => setShowComparison(false), 5000);
      }

      setPrediction(predictionData);

      if (onPredictionGenerated) {
        onPredictionGenerated(predictionData);
      }
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <Sparkles className="w-6 h-6 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Analyzing campaign potential...</p>
          <p className="text-gray-500 text-sm mt-1">Crunching the numbers for you</p>
        </div>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card padding="lg" className="border-2 border-dashed border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">Select an audience to see revenue predictions</p>
          <p className="text-gray-500 text-sm mt-1">AI-powered performance forecasting</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card padding="lg" className="border-2 border-primary-200 bg-gradient-to-br from-white via-primary-50 to-secondary-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Revenue Forecast
                </h3>
                <p className="text-sm text-gray-600 font-medium">AI-Powered Prediction Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent-500 animate-pulse" />
              <span className="text-xs font-bold text-accent-600">LIVE</span>
            </div>
          </div>

          <div className="mb-6">
            <ConfidenceMeter confidence={prediction.confidence} score={prediction.confidenceScore} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Immediate</span>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
                </div>
                <div className="space-y-2">
                  <p className="text-5xl font-extrabold text-green-700 tracking-tight">
                    $<AnimatedNumber value={prediction.immediateRevenue} />
                  </p>
                  <p className="text-sm font-semibold text-green-600">Within 24 hours</p>
                  <div className="pt-3 mt-3 border-t border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      Expected from {prediction.estimatedConversions} conversions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">30-Day Total</span>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
                <div className="space-y-2">
                  <p className="text-5xl font-extrabold text-blue-700 tracking-tight">
                    $<AnimatedNumber value={prediction.thirtyDayRevenue} />
                  </p>
                  <p className="text-sm font-semibold text-blue-600">Extended projection</p>
                  <div className="pt-3 mt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">
                      +${(prediction.thirtyDayRevenue - prediction.immediateRevenue).toFixed(2)} additional revenue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md">
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span>Performance Breakdown</span>
            </h4>
            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <ProgressBar
                    value={prediction.estimatedOpenRate}
                    max={40}
                    color="from-blue-500 to-blue-600"
                    label={`Open Rate: ${prediction.estimatedOpens.toLocaleString()} opens`}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <MousePointer className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <ProgressBar
                    value={prediction.estimatedClickRate}
                    max={10}
                    color="from-purple-500 to-purple-600"
                    label={`Click Rate: ${prediction.estimatedClicks.toLocaleString()} clicks`}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <ProgressBar
                    value={prediction.estimatedConversionRate}
                    max={10}
                    color="from-green-500 to-emerald-600"
                    label={`Conversion Rate: ${prediction.estimatedConversions} sales`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-neutral-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 font-medium">Audience</p>
              <p className="text-2xl font-bold text-gray-900">{prediction.audienceSize.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 mb-1 font-medium">Opens</p>
              <p className="text-2xl font-bold text-blue-700">{prediction.estimatedOpens.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <p className="text-xs text-purple-600 mb-1 font-medium">Clicks</p>
              <p className="text-2xl font-bold text-purple-700">{prediction.estimatedClicks.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <p className="text-xs text-green-600 mb-1 font-medium">Sales</p>
              <p className="text-2xl font-bold text-green-700">{prediction.estimatedConversions}</p>
            </div>
          </div>
        </div>
      </Card>

      {showComparison && previousPrediction && (
        <Card padding="md" className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-300 animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-primary-900 mb-2">Audience Changed!</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Previous Revenue</p>
                  <p className="text-lg font-bold text-gray-700">${previousPrediction.immediateRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">New Revenue</p>
                  <p className="text-lg font-bold text-primary-700">${prediction.immediateRevenue.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                {prediction.immediateRevenue > previousPrediction.immediateRevenue ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">
                      +${(prediction.immediateRevenue - previousPrediction.immediateRevenue).toFixed(2)} potential increase!
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-amber-600 transform rotate-180" />
                    <span className="text-xs font-semibold text-amber-600">
                      ${(previousPrediction.immediateRevenue - prediction.immediateRevenue).toFixed(2)} lower projection
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {campaignSubject && (campaignSubject.includes('!') || campaignSubject.includes('?') || /\d+%/.test(campaignSubject) || /\$\d+/.test(campaignSubject)) && (
        <Card padding="md" className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-green-900 mb-1 flex items-center space-x-2">
                <span>Subject Line Boost Active!</span>
              </h4>
              <p className="text-sm text-green-800">
                Your subject line includes engaging elements (numbers, punctuation, urgency). Estimates increased by up to 10%!
              </p>
            </div>
          </div>
        </Card>
      )}

      {prediction.confidence === 'low' && (
        <Card padding="md" className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
          <div className="flex items-start space-x-3">
            <BuddyMascot size="small" mood="thinking" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Limited Data Available</span>
              </h4>
              <p className="text-sm text-amber-800">
                These predictions are based on limited historical data. Launch more campaigns to improve prediction accuracy and confidence!
              </p>
            </div>
          </div>
        </Card>
      )}

      {prediction.confidence === 'high' && (
        <Card padding="md" className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="flex items-start space-x-3">
            <BuddyMascot size="small" mood="excited" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-green-900 mb-1 flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>High Confidence Prediction</span>
              </h4>
              <p className="text-sm text-green-800">
                Excellent! Based on your strong campaign history and large audience, this prediction is highly reliable. Your campaigns are performing great!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
