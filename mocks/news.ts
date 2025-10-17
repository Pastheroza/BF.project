// NewsItem - тип данных для одной новости
export type NewsItem = {
  id: string;
  // Секция 1: Основная новость (newsSection)
  title: string; // Заголовок новости
  snippet: string; // Короткий текст новости
  imageUrl: string; // URL изображения для новости
  source: string; // Источник новости (например, "Bloomberg", "Reuters")
  timestamp: string; // Время публикации
  
  // Секция 2: Информация о ценах акций (stocksSection)
  relatedStocks: Stock[]; // Array of related companies and their stocks
  
  // Секция 3: Прогноз влияния (predictionSection)
  prediction: Prediction; // Prediction of news impact
};

// Stock - тип данных для информации об акции
export type Stock = {
  symbol: string; // Company ticker (e.g., "AAPL")
  companyName: string; // Company name (e.g., "Apple Inc.")
  currentPrice: number; // Current stock price
  priceChange: number; // Price change in percentage
  priceChangeValue: number; // Price change in dollars
};

// Prediction - тип данных для прогноза
export type Prediction = {
  sentiment: 'positive' | 'negative' | 'neutral'; // Overall sentiment
  shortAnalysis: string; // Brief critical analysis for preview (2-3 sentences)
  description: string; // Detailed prediction description
  impactLevel: 'low' | 'medium' | 'high'; // Impact level
  timeframe: string; // Time horizon (e.g., "short-term", "long-term")
  keyPoints: string[]; // Key points of the prediction
};

// mockNewsData - массив новостей для демонстрации
export const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Apple Unveils Revolutionary Vision Pro 2',
    snippet: 'Apple announced the second version of its mixed reality headset with improved resolution and up to 8 hours of battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=800&q=80',
    source: 'Bloomberg',
    timestamp: '2 hours ago',
    relatedStocks: [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        currentPrice: 178.45,
        priceChange: 2.34,
        priceChangeValue: 4.08
      },
      {
        symbol: 'META',
        companyName: 'Meta Platforms',
        currentPrice: 332.12,
        priceChange: -0.87,
        priceChangeValue: -2.91
      }
    ],
    prediction: {
      sentiment: 'positive',
      shortAnalysis: 'This product launch signals Apple\'s strong commitment to the AR/VR market. The improved specs should drive adoption among early adopters and enterprises, potentially boosting AAPL stock by 8-12% over the next quarter as investors price in future wearables revenue.',
      description: 'The launch of Vision Pro 2 could significantly increase Apple\'s revenue in the wearables segment, establishing a stronger foothold in the emerging mixed reality market.',
      impactLevel: 'high',
      timeframe: 'Mid-term (3-6 months)',
      keyPoints: [
        'Potential revenue growth of 15-20% in Q2',
        'Increased market share in AR/VR devices',
        'Potential pressure on competitors (Meta, Sony)',
        'Positive impact on developer ecosystem'
      ]
    }
  },
  {
    id: '2',
    title: 'Tesla Reaches Record Production Levels',
    snippet: 'Tesla reported producing 500,000 electric vehicles in the last quarter, exceeding analyst expectations by 12%.',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    source: 'Reuters',
    timestamp: '4 hours ago',
    relatedStocks: [
      {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        currentPrice: 242.87,
        priceChange: 5.67,
        priceChangeValue: 13.02
      },
      {
        symbol: 'GM',
        companyName: 'General Motors',
        currentPrice: 38.92,
        priceChange: -1.23,
        priceChangeValue: -0.48
      },
      {
        symbol: 'F',
        companyName: 'Ford Motor',
        currentPrice: 12.45,
        priceChange: -0.95,
        priceChangeValue: -0.12
      }
    ],
    prediction: {
      sentiment: 'positive',
      shortAnalysis: 'Beating production targets by 12% demonstrates Tesla\'s operational excellence and growing demand. This should trigger analyst upgrades and push TSLA higher. Traditional automakers like GM and Ford face increased competitive pressure, likely seeing downward revisions.',
      description: 'Record production strengthens Tesla\'s position as the leader in the electric vehicle market and validates their manufacturing scalability.',
      impactLevel: 'high',
      timeframe: 'Short-term (1-3 months)',
      keyPoints: [
        'Exceeding forecasts could lead to 8-10% growth',
        'Improved operational efficiency',
        'Negative pressure on traditional automakers',
        'Possible analyst target price increases'
      ]
    }
  },
  {
    id: '3',
    title: 'Fed Signals Possible Rate Cuts',
    snippet: 'The Federal Reserve hinted at a potential reduction in interest rates in the next quarter.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    source: 'Financial Times',
    timestamp: '6 hours ago',
    relatedStocks: [
      {
        symbol: 'JPM',
        companyName: 'JPMorgan Chase',
        currentPrice: 156.78,
        priceChange: -1.45,
        priceChangeValue: -2.31
      },
      {
        symbol: 'BAC',
        companyName: 'Bank of America',
        currentPrice: 34.56,
        priceChange: -1.89,
        priceChangeValue: -0.67
      },
      {
        symbol: 'GS',
        companyName: 'Goldman Sachs',
        currentPrice: 389.23,
        priceChange: -2.12,
        priceChangeValue: -8.43
      }
    ],
    prediction: {
      sentiment: 'negative',
      shortAnalysis: 'Lower interest rates compress bank net interest margins, which is why JPM, BAC, and GS are declining. However, this creates opportunity in rate-sensitive sectors like tech and real estate. Banks could see 5-8% downside near-term, but the broader market may rally.',
      description: 'Rate cuts could negatively impact bank margins in the short term but ultimately stimulate broader economic activity and market growth.',
      impactLevel: 'medium',
      timeframe: 'Mid-term (3-6 months)',
      keyPoints: [
        'Compression of interest margins for banks',
        'Positive for high-valuation tech companies',
        'Potential lending growth',
        'Overall economic stimulus'
      ]
    }
  },
  {
    id: '4',
    title: 'NVIDIA Announces New Generation of AI Chips',
    snippet: 'NVIDIA introduced the H200 chips, promising 2x performance in machine learning tasks compared to the H100.',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    source: 'TechCrunch',
    timestamp: '8 hours ago',
    relatedStocks: [
      {
        symbol: 'NVDA',
        companyName: 'NVIDIA Corp.',
        currentPrice: 478.92,
        priceChange: 7.23,
        priceChangeValue: 32.31
      },
      {
        symbol: 'AMD',
        companyName: 'Advanced Micro Devices',
        currentPrice: 142.67,
        priceChange: -2.34,
        priceChangeValue: -3.42
      },
      {
        symbol: 'INTC',
        companyName: 'Intel Corp.',
        currentPrice: 43.21,
        priceChange: -1.56,
        priceChangeValue: -0.68
      }
    ],
    prediction: {
      sentiment: 'positive',
      shortAnalysis: 'The H200 launch cements NVIDIA\'s AI chip monopoly. With 2x performance gains, hyperscalers will rush to upgrade, driving massive orders. NVDA could see 20-25% upside as revenue guidance increases. AMD and Intel face continued share loss and margin pressure.',
      description: 'The new chips strengthen NVIDIA\'s dominance in the $150 billion AI accelerator market, creating a widening technological moat.',
      impactLevel: 'high',
      timeframe: 'Long-term (6-12 months)',
      keyPoints: [
        'Expected revenue growth of 25-30% in 2025',
        'Widening gap from competitors',
        'High demand from major tech companies',
        'Risk of regulatory restrictions on exports to China'
      ]
    }
  },
  {
    id: '5',
    title: 'Amazon Expands Data Center Network',
    snippet: 'Amazon Web Services announced a $10 billion investment to build new cloud data centers.',
    imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80',
    source: 'CNBC',
    timestamp: '10 hours ago',
    relatedStocks: [
      {
        symbol: 'AMZN',
        companyName: 'Amazon.com Inc.',
        currentPrice: 142.35,
        priceChange: 1.87,
        priceChangeValue: 2.61
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corp.',
        currentPrice: 378.91,
        priceChange: 0.45,
        priceChangeValue: 1.70
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        currentPrice: 139.82,
        priceChange: 0.23,
        priceChangeValue: 0.32
      }
    ],
    prediction: {
      sentiment: 'positive',
      shortAnalysis: 'Amazon\'s $10B infrastructure bet signals robust cloud demand and AI workload growth. While capex will temporarily pressure margins, this positions AWS to maintain its 32% market share lead. AMZN should see modest 3-5% gains as investors value long-term positioning over near-term margin compression.',
      description: 'Infrastructure investments strengthen AWS\'s position as the leader in the cloud market and support the growing AI and enterprise workload demands.',
      impactLevel: 'medium',
      timeframe: 'Long-term (6-12 months)',
      keyPoints: [
        'Maintaining cloud market leadership (32% share)',
        'Increased capital expenditures may pressure margins',
        'Positive signal of growing demand for cloud services',
        'Competition with Microsoft Azure and Google Cloud'
      ]
    }
  }
];
