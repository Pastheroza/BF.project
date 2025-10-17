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
  relatedStocks: Stock[]; // Массив связанных компаний и их акций
  
  // Секция 3: Прогноз влияния (predictionSection)
  prediction: Prediction; // Прогноз влияния новости
};

// Stock - тип данных для информации об акции
export type Stock = {
  symbol: string; // Тикер компании (например, "AAPL")
  companyName: string; // Название компании (например, "Apple Inc.")
  currentPrice: number; // Текущая цена акции
  priceChange: number; // Изменение цены в процентах
  priceChangeValue: number; // Изменение цены в долларах
};

// Prediction - тип данных для прогноза
export type Prediction = {
  sentiment: 'positive' | 'negative' | 'neutral'; // Общий сентимент
  description: string; // Описание прогноза
  impactLevel: 'low' | 'medium' | 'high'; // Уровень влияния
  timeframe: string; // Временной горизонт (например, "краткосрочный", "долгосрочный")
  keyPoints: string[]; // Ключевые пункты прогноза
};

// mockNewsData - массив новостей для демонстрации
export const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Apple представила революционный Vision Pro 2',
    snippet: 'Apple анонсировала вторую версию гарнитуры смешанной реальности с улучшенным разрешением и автономностью до 8 часов.',
    imageUrl: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=800&q=80',
    source: 'Bloomberg',
    timestamp: '2 часа назад',
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
      description: 'Запуск Vision Pro 2 может значительно увеличить доходы Apple в сегменте носимых устройств.',
      impactLevel: 'high',
      timeframe: 'Среднесрочный (3-6 месяцев)',
      keyPoints: [
        'Потенциальный рост выручки на 15-20% в Q2',
        'Увеличение доли рынка AR/VR устройств',
        'Возможное давление на конкурентов (Meta, Sony)',
        'Позитивное влияние на экосистему разработчиков'
      ]
    }
  },
  {
    id: '2',
    title: 'Tesla достигла рекордного уровня производства',
    snippet: 'Tesla сообщила о производстве 500,000 электромобилей в последнем квартале, превысив ожидания аналитиков на 12%.',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    source: 'Reuters',
    timestamp: '4 часа назад',
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
      description: 'Рекордное производство укрепляет позиции Tesla как лидера рынка электромобилей.',
      impactLevel: 'high',
      timeframe: 'Краткосрочный (1-3 месяца)',
      keyPoints: [
        'Превышение прогнозов может привести к росту на 8-10%',
        'Улучшение операционной эффективности',
        'Негативное давление на традиционных автопроизводителей',
        'Возможное повышение целевой цены аналитиками'
      ]
    }
  },
  {
    id: '3',
    title: 'ФРС сигнализирует о возможном снижении ставок',
    snippet: 'Федеральная резервная система США намекнула на потенциальное снижение процентных ставок в следующем квартале.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    source: 'Financial Times',
    timestamp: '6 часов назад',
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
      description: 'Снижение ставок может негативно повлиять на маржу банков, но стимулировать общий рынок.',
      impactLevel: 'medium',
      timeframe: 'Среднесрочный (3-6 месяцев)',
      keyPoints: [
        'Сжатие процентной маржи для банков',
        'Позитив для технологических компаний с высокой оценкой',
        'Возможный рост кредитования',
        'Общее стимулирование экономики'
      ]
    }
  },
  {
    id: '4',
    title: 'NVIDIA анонсирует новое поколение чипов для ИИ',
    snippet: 'NVIDIA представила чипы H200, обещающие 2x производительность в задачах машинного обучения по сравнению с H100.',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    source: 'TechCrunch',
    timestamp: '8 часов назад',
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
      description: 'Новые чипы укрепляют доминирование NVIDIA на рынке ИИ-ускорителей стоимостью $150 млрд.',
      impactLevel: 'high',
      timeframe: 'Долгосрочный (6-12 месяцев)',
      keyPoints: [
        'Ожидаемый рост выручки на 25-30% в 2025',
        'Увеличение отрыва от конкурентов',
        'Высокий спрос от крупных tech-компаний',
        'Риск регуляторных ограничений на экспорт в Китай'
      ]
    }
  },
  {
    id: '5',
    title: 'Amazon расширяет сеть дата-центров',
    snippet: 'Amazon Web Services объявила об инвестициях в $10 млрд для строительства новых облачных дата-центров.',
    imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80',
    source: 'CNBC',
    timestamp: '10 часов назад',
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
      description: 'Инвестиции в инфраструктуру укрепляют позиции AWS как лидера облачного рынка.',
      impactLevel: 'medium',
      timeframe: 'Долгосрочный (6-12 месяцев)',
      keyPoints: [
        'Поддержание лидерства на рынке cloud (32% доли)',
        'Увеличение капитальных затрат может давить на маржу',
        'Позитивный сигнал о росте спроса на облачные услуги',
        'Конкуренция с Microsoft Azure и Google Cloud'
      ]
    }
  }
];
