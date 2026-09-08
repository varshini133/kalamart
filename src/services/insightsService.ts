/**
 * KalaMart AI - Artisan Business Insights Service
 * Generates actionable intelligence on views, buyer trends, and stock recommendations.
 */

export interface BusinessInsight {
  id: string;
  type: 'growth' | 'suggestion' | 'trend' | 'alert';
  title: string;
  description: string;
  hindiTitle?: string;
  impactScore: string;
  icon: string;
  actionText?: string;
}

export interface ArtisanSummaryStats {
  totalEarnings: number;
  ordersCount: number;
  totalViews: number;
  productsListed: number;
  weeklyGrowth: number;
  topCategory: string;
}

export const getArtisanInsights = async (): Promise<BusinessInsight[]> => {
  return [
    {
      id: 'ins-1',
      type: 'growth',
      title: 'Terracotta Views Surge +28%',
      hindiTitle: 'मिट्टी के बर्तनों की मांग में 28% वृद्धि',
      description:
        'Your Terracotta Water Pitchers are receiving 28% more buyer views this week ahead of the summer season in Bengaluru & Delhi.',
      impactScore: '+₹4,200 potential sales',
      icon: 'trending_up',
      actionText: 'List 2 More Units'
    },
    {
      id: 'ins-2',
      type: 'suggestion',
      title: 'Multiple Photos Drive 3x Conversions',
      hindiTitle: '3 या अधिक फोटो से 3 गुना अधिक बिक्री',
      description:
        'Listings with 3 or more angle photos (lid detail, clay texture) achieve a 72% faster purchase checkout rate.',
      impactScore: '3x higher order conversion',
      icon: 'add_a_photo',
      actionText: 'Enhance Photos with AI'
    },
    {
      id: 'ins-3',
      type: 'trend',
      title: 'Top Category: Heritage Home Decor',
      hindiTitle: 'सर्वाधिक लोकप्रिय: होम डेकोर और उपहार',
      description:
        'Corporate gifting buyers are actively searching for festive Terracotta Urli Diya sets in bulk packages of 5-10.',
      impactScore: 'High bulk buyer interest',
      icon: 'auto_awesome',
      actionText: 'View Market Demand'
    },
    {
      id: 'ins-4',
      type: 'alert',
      title: 'Low Stock Alert: Urli Diya Set',
      hindiTitle: 'स्टॉक कम है: केवल 2 यूनिट शेष',
      description:
        'Only 2 sets remaining in stock. Consider updating your production batch to prevent lost sales.',
      impactScore: '2 units left in studio',
      icon: 'inventory_2',
      actionText: 'Restock Product'
    }
  ];
};

export const getArtisanStats = (timeframe: 'weekly' | 'monthly'): ArtisanSummaryStats => {
  if (timeframe === 'weekly') {
    return {
      totalEarnings: 14850,
      ordersCount: 6,
      totalViews: 840,
      productsListed: 8,
      weeklyGrowth: 24.5,
      topCategory: 'Kutch Terracotta'
    };
  }

  return {
    totalEarnings: 62400,
    ordersCount: 28,
    totalViews: 3450,
    productsListed: 12,
    weeklyGrowth: 31.2,
    topCategory: 'Earthen Clayware'
  };
};
