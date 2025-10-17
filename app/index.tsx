import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ViewToken,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Settings, User, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { mockNewsData, NewsItem } from '@/mocks/news';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Цветовая палитра приложения (appColors)
const appColors = {
  dark: '#0c0c0c', // Темный фон
  light: '#fbfbfb', // Светлый текст
  positive: '#10b981', // Зеленый для положительных изменений
  negative: '#ef4444', // Красный для отрицательных изменений
  neutral: '#6b7280', // Серый для нейтральных значений
  cardBg: '#1a1a1a', // Фон для карточек
} as const;

// NewsCard - компонент для отображения одной новости
// Содержит три горизонтальные секции: новость, акции, прогноз
function NewsCard({ item }: { item: NewsItem }) {
  // Состояние текущей активной секции (currentSection)
  const [currentSection, setCurrentSection] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Обработчик прокрутки горизонтального ScrollView (handleScroll)
  const handleScroll = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const sectionIndex = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentSection(sectionIndex);
  }, []);

  return (
    <View style={styles.newsCard}>
      {/* Горизонтальный ScrollView с тремя секциями (sectionsScrollView) */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Секция 1: Основная новость (newsSection) */}
        <View style={styles.section}>
          {/* Изображение новости (newsImage) */}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.newsImage}
            resizeMode="cover"
          />
          
          {/* Контейнер для текстового контента (newsContent) */}
          <View style={styles.newsContent}>
            {/* Метаинформация: источник и время (newsMeta) */}
            <View style={styles.newsMeta}>
              <Text style={styles.newsSource}>{item.source}</Text>
              <Text style={styles.newsTimestamp}>{item.timestamp}</Text>
            </View>
            
            {/* Заголовок новости (newsTitle) */}
            <Text style={styles.newsTitle}>{item.title}</Text>
            
            {/* Краткое описание новости (newsSnippet) */}
            <Text style={styles.newsSnippet}>{item.snippet}</Text>
          </View>
        </View>

        {/* Секция 2: Информация о ценах акций (stocksSection) */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            {/* Заголовок секции акций (stocksSectionTitle) */}
            <Text style={styles.sectionTitle}>Связанные акции</Text>
            
            {/* Список акций (stocksList) */}
            <View style={styles.stocksList}>
              {item.relatedStocks.map((stock, index) => (
                // Карточка акции (stockCard)
                <View key={index} style={styles.stockCard}>
                  <View style={styles.stockHeader}>
                    {/* Тикер компании (stockSymbol) */}
                    <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                    {/* Иконка изменения цены (priceChangeIcon) */}
                    {stock.priceChange > 0 ? (
                      <TrendingUp size={20} color={appColors.positive} />
                    ) : stock.priceChange < 0 ? (
                      <TrendingDown size={20} color={appColors.negative} />
                    ) : (
                      <Minus size={20} color={appColors.neutral} />
                    )}
                  </View>
                  
                  {/* Название компании (stockCompanyName) */}
                  <Text style={styles.stockCompanyName}>{stock.companyName}</Text>
                  
                  {/* Контейнер цены (stockPriceContainer) */}
                  <View style={styles.stockPriceContainer}>
                    {/* Текущая цена (stockCurrentPrice) */}
                    <Text style={styles.stockCurrentPrice}>
                      ${stock.currentPrice.toFixed(2)}
                    </Text>
                    
                    {/* Изменение цены (stockPriceChange) */}
                    <Text
                      style={[
                        styles.stockPriceChange,
                        {
                          color:
                            stock.priceChange > 0
                              ? appColors.positive
                              : stock.priceChange < 0
                              ? appColors.negative
                              : appColors.neutral,
                        },
                      ]}
                    >
                      {stock.priceChange > 0 ? '+' : ''}
                      {stock.priceChange.toFixed(2)}% (${stock.priceChangeValue > 0 ? '+' : ''}
                      {stock.priceChangeValue.toFixed(2)})
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Секция 3: Прогноз влияния (predictionSection) */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            {/* Заголовок секции прогноза (predictionSectionTitle) */}
            <Text style={styles.sectionTitle}>Прогноз влияния</Text>
            
            {/* Контейнер сентимента (sentimentContainer) */}
            <View
              style={[
                styles.sentimentContainer,
                {
                  backgroundColor:
                    item.prediction.sentiment === 'positive'
                      ? `${appColors.positive}20`
                      : item.prediction.sentiment === 'negative'
                      ? `${appColors.negative}20`
                      : `${appColors.neutral}20`,
                },
              ]}
            >
              {/* Метка сентимента (sentimentBadge) */}
              <View
                style={[
                  styles.sentimentBadge,
                  {
                    backgroundColor:
                      item.prediction.sentiment === 'positive'
                        ? appColors.positive
                        : item.prediction.sentiment === 'negative'
                        ? appColors.negative
                        : appColors.neutral,
                  },
                ]}
              >
                <Text style={styles.sentimentText}>
                  {item.prediction.sentiment === 'positive'
                    ? 'ПОЗИТИВНЫЙ'
                    : item.prediction.sentiment === 'negative'
                    ? 'НЕГАТИВНЫЙ'
                    : 'НЕЙТРАЛЬНЫЙ'}
                </Text>
              </View>
              
              {/* Уровень влияния (impactLevel) */}
              <Text style={styles.impactLevel}>
                Уровень влияния:{' '}
                <Text style={styles.impactLevelValue}>
                  {item.prediction.impactLevel === 'high'
                    ? 'ВЫСОКИЙ'
                    : item.prediction.impactLevel === 'medium'
                    ? 'СРЕДНИЙ'
                    : 'НИЗКИЙ'}
                </Text>
              </Text>
            </View>
            
            {/* Временной горизонт (timeframe) */}
            <Text style={styles.timeframe}>{item.prediction.timeframe}</Text>
            
            {/* Описание прогноза (predictionDescription) */}
            <Text style={styles.predictionDescription}>
              {item.prediction.description}
            </Text>
            
            {/* Ключевые пункты (keyPoints) */}
            <Text style={styles.keyPointsTitle}>Ключевые пункты:</Text>
            <View style={styles.keyPointsList}>
              {item.prediction.keyPoints.map((point, index) => (
                <View key={index} style={styles.keyPointItem}>
                  <View style={styles.keyPointBullet} />
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Индикаторы секций (sectionIndicators) */}
      <View style={styles.sectionIndicators}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSection === index && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// NewsFeedScreen - главный экран с вертикальной прокруткой новостей
export default function NewsFeedScreen() {
  const flatListRef = useRef<FlatList>(null);

  // Обработчик изменения видимых элементов (onViewableItemsChanged)
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      console.log('Current visible news:', viewableItems[0]?.index);
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      {/* Настройка заголовка с кнопками (headerConfig) */}
      <Stack.Screen
        options={{
          title: '',
          headerStyle: {
            backgroundColor: appColors.dark,
          },
          headerTintColor: appColors.light,
          // Кнопка настроек слева (settingsButton)
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('./settings')}
            >
              <Settings size={24} color={appColors.light} />
            </TouchableOpacity>
          ),
          // Кнопка профиля справа (profileButton)
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push('./profile')}
            >
              <User size={24} color={appColors.light} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Вертикальный список новостей (newsFeed) */}
      <FlatList
        ref={flatListRef}
        data={mockNewsData}
        renderItem={({ item }) => <NewsCard item={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.dark,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  newsCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: appColors.dark,
  },
  section: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  newsImage: {
    width: '100%',
    height: '50%',
  },
  newsContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  newsSource: {
    color: appColors.positive,
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
  },
  newsTimestamp: {
    color: appColors.neutral,
    fontSize: 12,
  },
  newsTitle: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 12,
    lineHeight: 32,
  },
  newsSnippet: {
    color: appColors.neutral,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: appColors.light,
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 24,
  },
  stocksList: {
    gap: 16,
  },
  stockCard: {
    backgroundColor: appColors.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockSymbol: {
    color: appColors.light,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  stockCompanyName: {
    color: appColors.neutral,
    fontSize: 14,
  },
  stockPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stockCurrentPrice: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  stockPriceChange: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  sentimentContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sentimentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  sentimentText: {
    color: appColors.light,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  impactLevel: {
    color: appColors.neutral,
    fontSize: 14,
  },
  impactLevelValue: {
    color: appColors.light,
    fontWeight: '700' as const,
  },
  timeframe: {
    color: appColors.positive,
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  predictionDescription: {
    color: appColors.light,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  keyPointsTitle: {
    color: appColors.light,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  keyPointsList: {
    gap: 12,
  },
  keyPointItem: {
    flexDirection: 'row',
    gap: 12,
  },
  keyPointBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appColors.positive,
    marginTop: 8,
  },
  keyPointText: {
    flex: 1,
    color: appColors.neutral,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionIndicators: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.neutral,
    opacity: 0.5,
  },
  indicatorActive: {
    backgroundColor: appColors.light,
    opacity: 1,
  },
});
