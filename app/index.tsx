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
  Modal,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Settings, User, TrendingUp, TrendingDown, Minus, X } from 'lucide-react-native';
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
// Содержит три окна: новость (40%), акции (15%), прогноз (30%)
function NewsCard({ item }: { item: NewsItem }) {
  // Состояние для раскрытия новости на весь экран (isExpanded)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Обработчик нажатия на окно новости (handleNewsPress)
  const handleNewsPress = useCallback(() => {
    setIsExpanded(true);
  }, []);

  // Обработчик закрытия полноэкранной новости (handleClose)
  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <View style={styles.newsCard}>
      {/* Окно 1: Основная новость (newsWindow) - 40% экрана */}
      <TouchableOpacity 
        style={styles.newsWindow} 
        activeOpacity={0.95}
        onPress={handleNewsPress}
      >
        <View style={styles.newsCardContent}>
          {/* Изображение новости (newsImage) */}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.newsImage}
            resizeMode="cover"
          />
          
          {/* Оверлей с градиентом для читаемости текста (newsOverlay) */}
          <View style={styles.newsOverlay} />
          
          {/* Контейнер для текстового контента (newsTextContent) */}
          <View style={styles.newsTextContent}>
            {/* Метаинформация: источник и время (newsMeta) */}
            <View style={styles.newsMeta}>
              <Text style={styles.newsSource}>{item.source}</Text>
              <Text style={styles.newsTimestamp}>{item.timestamp}</Text>
            </View>
            
            {/* Заголовок новости (newsTitle) */}
            <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
            
            {/* Краткое описание новости (newsSnippet) */}
            <Text style={styles.newsSnippet} numberOfLines={2}>{item.snippet}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Окно 2: Информация о ценах акций (stocksWindow) - 15% экрана */}
      <View style={styles.stocksWindow}>
        <View style={styles.stocksContent}>
          {/* Заголовок секции акций (stocksTitle) */}
          <Text style={styles.stocksTitle}>Related Stocks</Text>
          
          {/* Горизонтальный список акций (stocksHorizontalList) */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stocksScrollContent}
          >
            {item.relatedStocks.map((stock, index) => (
              // Компактная карточка акции (compactStockCard)
              <View key={index} style={styles.compactStockCard}>
                <View style={styles.stockTopRow}>
                  {/* Тикер компании (stockSymbol) */}
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  {/* Иконка изменения цены (priceChangeIcon) */}
                  {stock.priceChange > 0 ? (
                    <TrendingUp size={16} color={appColors.positive} />
                  ) : stock.priceChange < 0 ? (
                    <TrendingDown size={16} color={appColors.negative} />
                  ) : (
                    <Minus size={16} color={appColors.neutral} />
                  )}
                </View>
                
                {/* Текущая цена (stockPrice) */}
                <Text style={styles.stockPrice}>
                  ${stock.currentPrice.toFixed(2)}
                </Text>
                
                {/* Изменение цены (stockChange) */}
                <Text
                  style={[
                    styles.stockChange,
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
                  {stock.priceChange.toFixed(2)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Окно 3: Прогноз влияния (predictionWindow) - 30% экрана */}
      <View style={styles.predictionWindow}>
        <View style={styles.predictionContent}>
          {/* Заголовок секции прогноза (predictionTitle) */}
          <Text style={styles.predictionTitle}>Impact Forecast</Text>
          
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
                  ? 'POSITIVE'
                  : item.prediction.sentiment === 'negative'
                  ? 'NEGATIVE'
                  : 'NEUTRAL'}
              </Text>
            </View>
            
            {/* Уровень влияния (impactLevel) */}
            <Text style={styles.impactLevel}>
              Impact Level:{' '}
              <Text style={styles.impactLevelValue}>
                {item.prediction.impactLevel === 'high'
                  ? 'HIGH'
                  : item.prediction.impactLevel === 'medium'
                  ? 'MEDIUM'
                  : 'LOW'}
              </Text>
            </Text>
          </View>
          
          {/* Временной горизонт (timeframe) */}
          <Text style={styles.timeframe}>{item.prediction.timeframe}</Text>
          
          {/* Описание прогноза (predictionDescription) */}
          <Text style={styles.predictionDescription} numberOfLines={3}>
            {item.prediction.description}
          </Text>
        </View>
      </View>

      {/* Модальное окно для полноэкранного просмотра новости (expandedNewsModal) */}
      <Modal
        visible={isExpanded}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.expandedContainer}>
          {/* Изображение в полноэкранном режиме (expandedNewsImage) */}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.expandedNewsImage}
            resizeMode="cover"
          />
          
          {/* Кнопка закрытия (closeButton) */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={28} color={appColors.light} />
          </TouchableOpacity>
          
          {/* Прокручиваемый контент новости (expandedScrollContent) */}
          <ScrollView style={styles.expandedScrollView} contentContainerStyle={styles.expandedContent}>
            {/* Метаинформация (expandedNewsMeta) */}
            <View style={styles.expandedNewsMeta}>
              <Text style={styles.expandedNewsSource}>{item.source}</Text>
              <Text style={styles.expandedNewsTimestamp}>{item.timestamp}</Text>
            </View>
            
            {/* Заголовок (expandedNewsTitle) */}
            <Text style={styles.expandedNewsTitle}>{item.title}</Text>
            
            {/* Полный текст новости (expandedNewsText) */}
            <Text style={styles.expandedNewsText}>{item.snippet}</Text>
            
            {/* Связанные акции в развернутом виде (expandedStocksSection) */}
            <Text style={styles.expandedSectionTitle}>Related Stocks</Text>
            <View style={styles.expandedStocksList}>
              {item.relatedStocks.map((stock, index) => (
                <View key={index} style={styles.expandedStockCard}>
                  <View style={styles.expandedStockHeader}>
                    <Text style={styles.expandedStockSymbol}>{stock.symbol}</Text>
                    {stock.priceChange > 0 ? (
                      <TrendingUp size={20} color={appColors.positive} />
                    ) : stock.priceChange < 0 ? (
                      <TrendingDown size={20} color={appColors.negative} />
                    ) : (
                      <Minus size={20} color={appColors.neutral} />
                    )}
                  </View>
                  <Text style={styles.expandedStockCompanyName}>{stock.companyName}</Text>
                  <View style={styles.expandedStockPriceContainer}>
                    <Text style={styles.expandedStockCurrentPrice}>
                      ${stock.currentPrice.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.expandedStockPriceChange,
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
            
            {/* Прогноз в развернутом виде (expandedPredictionSection) */}
            <Text style={styles.expandedSectionTitle}>Impact Forecast</Text>
            <View
              style={[
                styles.expandedSentimentContainer,
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
              <View
                style={[
                  styles.expandedSentimentBadge,
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
                <Text style={styles.expandedSentimentText}>
                  {item.prediction.sentiment === 'positive'
                    ? 'POSITIVE'
                    : item.prediction.sentiment === 'negative'
                    ? 'NEGATIVE'
                    : 'NEUTRAL'}
                </Text>
              </View>
              <Text style={styles.expandedImpactLevel}>
                Impact Level:{' '}
                <Text style={styles.expandedImpactLevelValue}>
                  {item.prediction.impactLevel === 'high'
                    ? 'HIGH'
                    : item.prediction.impactLevel === 'medium'
                    ? 'MEDIUM'
                    : 'LOW'}
                </Text>
              </Text>
            </View>
            <Text style={styles.expandedTimeframe}>{item.prediction.timeframe}</Text>
            <Text style={styles.expandedPredictionDescription}>
              {item.prediction.description}
            </Text>
            <Text style={styles.expandedKeyPointsTitle}>Key Points:</Text>
            <View style={styles.expandedKeyPointsList}>
              {item.prediction.keyPoints.map((point, index) => (
                <View key={index} style={styles.expandedKeyPointItem}>
                  <View style={styles.expandedKeyPointBullet} />
                  <Text style={styles.expandedKeyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// NewsFeedScreen - главный экран с вертикальной прокруткой новостей
export default function NewsFeedScreen() {
  const flatListRef = useRef<FlatList>(null);

  // Обработчик изменения видимых элементов (onViewableItemsChanged)
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.index !== null) {
        console.log('Current visible news:', viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('./settings')}
        >
          <Settings size={24} color={appColors.light} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('./profile')}
        >
          <User size={24} color={appColors.light} />
        </TouchableOpacity>
      </View>

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
        scrollEventThrottle={16}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.dark,
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: appColors.dark,
    paddingTop: 110,
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  newsWindow: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: appColors.cardBg,
    marginBottom: 12,
  },
  newsCardContent: {
    flex: 1,
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  newsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
  },
  newsTextContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
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
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
    lineHeight: 28,
  },
  newsSnippet: {
    color: appColors.neutral,
    fontSize: 14,
    lineHeight: 20,
  },
  stocksWindow: {
    height: 110,
    borderRadius: 24,
    backgroundColor: appColors.cardBg,
    overflow: 'hidden',
    marginBottom: 12,
  },
  stocksContent: {
    flex: 1,
    paddingVertical: 16,
  },
  stocksTitle: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  stocksScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  compactStockCard: {
    backgroundColor: appColors.dark,
    borderRadius: 16,
    padding: 12,
    minWidth: 120,
    gap: 4,
  },
  stockTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockSymbol: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  stockPrice: {
    color: appColors.light,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  stockChange: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  predictionWindow: {
    height: 180,
    borderRadius: 24,
    backgroundColor: appColors.cardBg,
    overflow: 'hidden',
  },
  predictionContent: {
    flex: 1,
    padding: 20,
  },
  predictionTitle: {
    color: appColors.light,
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  sentimentContainer: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  sentimentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  sentimentText: {
    color: appColors.light,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  impactLevel: {
    color: appColors.neutral,
    fontSize: 12,
  },
  impactLevelValue: {
    color: appColors.light,
    fontWeight: '700' as const,
  },
  timeframe: {
    color: appColors.positive,
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  predictionDescription: {
    color: appColors.light,
    fontSize: 13,
    lineHeight: 20,
  },
  expandedContainer: {
    flex: 1,
    backgroundColor: appColors.dark,
  },
  expandedNewsImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.35,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12, 12, 12, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  expandedScrollView: {
    flex: 1,
  },
  expandedContent: {
    padding: 20,
  },
  expandedNewsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  expandedNewsSource: {
    color: appColors.positive,
    fontSize: 14,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
  },
  expandedNewsTimestamp: {
    color: appColors.neutral,
    fontSize: 14,
  },
  expandedNewsTitle: {
    color: appColors.light,
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 16,
    lineHeight: 36,
  },
  expandedNewsText: {
    color: appColors.neutral,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 32,
  },
  expandedSectionTitle: {
    color: appColors.light,
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 16,
    marginTop: 8,
  },
  expandedStocksList: {
    gap: 12,
    marginBottom: 32,
  },
  expandedStockCard: {
    backgroundColor: appColors.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  expandedStockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedStockSymbol: {
    color: appColors.light,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  expandedStockCompanyName: {
    color: appColors.neutral,
    fontSize: 14,
  },
  expandedStockPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  expandedStockCurrentPrice: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  expandedStockPriceChange: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  expandedSentimentContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  expandedSentimentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  expandedSentimentText: {
    color: appColors.light,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  expandedImpactLevel: {
    color: appColors.neutral,
    fontSize: 14,
  },
  expandedImpactLevelValue: {
    color: appColors.light,
    fontWeight: '700' as const,
  },
  expandedTimeframe: {
    color: appColors.positive,
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  expandedPredictionDescription: {
    color: appColors.light,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  expandedKeyPointsTitle: {
    color: appColors.light,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  expandedKeyPointsList: {
    gap: 12,
    marginBottom: 40,
  },
  expandedKeyPointItem: {
    flexDirection: 'row',
    gap: 12,
  },
  expandedKeyPointBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appColors.positive,
    marginTop: 8,
  },
  expandedKeyPointText: {
    flex: 1,
    color: appColors.neutral,
    fontSize: 14,
    lineHeight: 22,
  },
});
