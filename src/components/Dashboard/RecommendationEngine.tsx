import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag, TrendingUp, Users, Loader2 } from 'lucide-react';
import BuddyMascot from '@/components/BuddyMascot';

interface Recommendation {
  productId: string;
  productName: string;
  confidence: number;
  support: number;
  lift: number;
  sales: number;
}

interface RecommendationEngineProps {
  selectedProduct?: string;
  onRecommendationSelect?: (recommendation: Recommendation) => void;
  onCreateCampaign?: () => void;
}

export default function RecommendationEngine({
  selectedProduct,
  onRecommendationSelect,
  onCreateCampaign,
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const mockProducts = [
    { id: 'PROD-101', name: 'Wireless Headphones', category: 'Electronics' },
    { id: 'PROD-202', name: 'Smartphone Case', category: 'Accessories' },
    { id: 'PROD-303', name: 'Portable Charger', category: 'Electronics' },
    { id: 'PROD-404', name: 'Bluetooth Speaker', category: 'Electronics' },
    { id: 'PROD-505', name: 'Screen Protector', category: 'Accessories' },
    { id: 'PROD-606', name: 'USB-C Cable', category: 'Accessories' },
    { id: 'PROD-707', name: 'Phone Stand', category: 'Accessories' },
  ];

  const generateRecommendations = async (productId: string) => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockRecs: Recommendation[] = mockProducts
      .filter(p => p.id !== productId)
      .slice(0, 4)
      .map(product => ({
        productId: product.id,
        productName: product.name,
        confidence: Math.random() * 0.4 + 0.6,
        support: Math.random() * 0.3 + 0.1,
        lift: Math.random() * 2 + 1.5,
        sales: Math.floor(Math.random() * 500) + 100,
      }))
      .sort((a, b) => b.confidence - a.confidence);

    setRecommendations(mockRecs);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedProduct) {
      generateRecommendations(selectedProduct);
    } else {
      setRecommendations([]);
    }
  }, [selectedProduct]);

  const handleRecommendationClick = (rec: Recommendation) => {
    setSelectedRecommendation(rec.productId);
    if (onRecommendationSelect) {
      onRecommendationSelect(rec);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-amber-600 bg-amber-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">AI Recommendation Engine</h3>
            <p className="text-sm text-gray-600">Product cross-sell suggestions</p>
          </div>
        </div>
      </div>

      {!selectedProduct ? (
        <div className="text-center py-8">
          <BuddyMascot mood="thinking" size="medium" />
          <p className="text-gray-600 mt-4">Select a product to see AI-powered recommendations</p>
          <p className="text-sm text-gray-500 mt-2">
            Our engine analyzes purchase patterns to suggest products customers buy together
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing purchase patterns...</p>
          <p className="text-sm text-gray-500 mt-2">Using market basket analysis</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Customers who bought <span className="font-semibold text-purple-600">{selectedProduct}</span> also bought:
            </p>
          </div>

          {recommendations.map((rec, index) => (
            <div
              key={rec.productId}
              onClick={() => handleRecommendationClick(rec)}
              className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                selectedRecommendation === rec.productId
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold text-gray-800">{rec.productName}</h4>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{rec.productId}</p>
                </div>
                <Badge className={getConfidenceColor(rec.confidence)}>
                  {(rec.confidence * 100).toFixed(0)}% match
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-medium">Lift</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{rec.lift.toFixed(2)}x</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs font-medium">Support</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{(rec.support * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <ShoppingBag className="w-3 h-3" />
                    <span className="text-xs font-medium">Sales</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{rec.sales}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Create Targeted Campaign</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Use these recommendations to create personalized email campaigns for customers who purchased this product
                </p>
                <Button
                  size="sm"
                  onClick={onCreateCampaign}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No recommendations available for this product</p>
        </div>
      )}
    </Card>
  );
}
