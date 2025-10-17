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
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Settings, User, TrendingUp, TrendingDown, Minus, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { mockNewsData, NewsItem } from '@/mocks/news';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const isDesktop = Platform.OS === 'web' && SCREEN_WIDTH >= 1024;

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
  const insets = useSafeAreaInsets();
  // Состояние для раскрытия новости на весь экран (isExpanded)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // Состояние для раскрытия прогноза на весь экран (isPredictionExpanded)
  const [isPredictionExpanded, setIsPredictionExpanded] = useState<boolean>(false);
  // Состояние для текущего индекса акции в горизонтальной прокрутке (currentStockIndex)
  const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);

  // Обработчик нажатия на окно новости (handleNewsPress)
  const handleNewsPress = useCallback(() => {
    setIsExpanded(true);
  }, []);

  // Обработчик закрытия полноэкранной новости (handleClose)
  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  // Обработчик нажатия на окно прогноза (handlePredictionPress)
  const handlePredictionPress = useCallback(() => {
    setIsPredictionExpanded(true);
  }, []);

  // Обработчик закрытия полноэкранного прогноза (handlePredictionClose)
  const handlePredictionClose = useCallback(() => {
    setIsPredictionExpanded(false);
  }, []);

  // Обработчик горизонтальной прокрутки акций (handleStockScroll)
  const handleStockScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (SCREEN_WIDTH - 32));
    setCurrentStockIndex(index);
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
          
          {/* Градиентный оверлей для читаемости текста (newsGradientOverlay) */}
          <LinearGradient
            colors={['transparent', 'rgba(12, 12, 12, 0.5)', 'rgba(12, 12, 12, 0.85)', 'rgba(12, 12, 12, 0.95)']}
            locations={[0.35, 0.5, 0.7, 1]}
            style={styles.newsGradientOverlay}
          >
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
          </LinearGradient>
        </View>
      </TouchableOpacity>

      {/* Окно 2: Информация о ценах акций (stocksWindow) - 15% экрана */}
      <View style={styles.stocksWindow}>
        <View style={styles.stocksContent}>
          {/* Заголовок секции акций (stocksTitle) */}
          <Text style={styles.stocksTitle}>Related Stocks</Text>
          
          {/* Горизонтальный пагинированный список акций (stocksPaginatedList) */}
          <ScrollView 
            horizontal 
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH - 32}
            snapToAlignment="center"
            onScroll={handleStockScroll}
            scrollEventThrottle={16}
          >
            {item.relatedStocks.map((stock, index) => (
              // Карточка одной акции на весь экран (stockCard)
              <View key={index} style={styles.stockCard}>
                <View style={styles.stockMainInfo}>
                  {/* Тикер компании с увеличенным шрифтом (stockSymbolLarge) */}
                  <Text style={styles.stockSymbolLarge}>{stock.symbol}</Text>
                  
                  {/* Текущая цена с увеличенным шрифтом (stockPriceLarge) */}
                  <Text style={styles.stockPriceLarge}>
                    ${stock.currentPrice.toFixed(2)}
                  </Text>
                </View>
                
                {/* Иконка изменения в верхнем правом углу (priceChangeIconTopRight) */}
                <View style={styles.priceChangeIconTopRight}>
                  {stock.priceChange > 0 ? (
                    <TrendingUp size={20} color={appColors.positive} />
                  ) : stock.priceChange < 0 ? (
                    <TrendingDown size={20} color={appColors.negative} />
                  ) : (
                    <Minus size={20} color={appColors.neutral} />
                  )}
                </View>
                
                {/* Процент изменения в нижнем правом углу (stockChangeBottomRight) */}
                <Text
                  style={[
                    styles.stockChangeBottomRight,
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
          
          {/* Индикаторы пагинации (paginationDots) */}
          <View style={styles.paginationDots}>
            {item.relatedStocks.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentStockIndex
                        ? appColors.light
                        : appColors.neutral,
                    opacity: index === currentStockIndex ? 1 : 0.3,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Окно 3: Прогноз влияния (predictionWindow) - 30% экрана */}
      <TouchableOpacity 
        style={styles.predictionWindow}
        activeOpacity={0.95}
        onPress={handlePredictionPress}
      >
        <View style={styles.predictionContent}>
          {/* Заголовок секции прогноза (predictionTitle) */}
          <Text style={styles.predictionTitle}>Impact Forecast</Text>
          
          {/* Краткий анализ влияния на акции (shortAnalysisContainer) */}
          <View style={styles.shortAnalysisContainer}>
            {/* Метка сентимента (sentimentBadgeSmall) */}
            <View
              style={[
                styles.sentimentBadgeSmall,
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
              <Text style={styles.sentimentTextSmall}>
                {item.prediction.sentiment === 'positive'
                  ? 'POSITIVE'
                  : item.prediction.sentiment === 'negative'
                  ? 'NEGATIVE'
                  : 'NEUTRAL'}
              </Text>
            </View>
            
            {/* Текст краткого анализа (shortAnalysisText) */}
            <Text style={styles.shortAnalysisText} numberOfLines={4}>
              {item.prediction.shortAnalysis}
            </Text>
            
            {/* Подсказка для пользователя (tapForDetailsHint) */}
            <Text style={styles.tapForDetailsHint}>Tap for detailed forecast</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Модальное окно для полноэкранного просмотра новости (expandedNewsModal) */}
      <Modal
        visible={isExpanded}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.expandedContainer}>
          {/* Безопасный отступ сверху (expandedTopSpacer) */}
          <View style={[styles.expandedTopSpacer, { height: insets.top + 20 }]} />
          
          {/* Изображение в полноэкранном режиме (expandedNewsImage) */}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.expandedNewsImage}
            resizeMode="cover"
          />
          
          {/* Кнопка закрытия (closeButton) */}
          <TouchableOpacity style={[styles.closeButton, { top: insets.top + 30 }]} onPress={handleClose}>
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

      {/* Модальное окно для полноэкранного просмотра прогноза (expandedPredictionModal) */}
      <Modal
        visible={isPredictionExpanded}
        animationType="slide"
        onRequestClose={handlePredictionClose}
      >
        <View style={styles.expandedContainer}>
          {/* Безопасный отступ сверху (expandedTopSpacer) */}
          <View style={[styles.expandedTopSpacer, { height: insets.top + 20 }]} />
          
          {/* Кнопка закрытия (closeButton) */}
          <TouchableOpacity style={[styles.closeButton, { top: insets.top + 30 }]} onPress={handlePredictionClose}>
            <X size={28} color={appColors.light} />
          </TouchableOpacity>
          
          {/* Прокручиваемый контент прогноза (expandedPredictionScrollContent) */}
          <ScrollView style={styles.expandedScrollView} contentContainerStyle={styles.expandedContent}>
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

// DesktopNewsCard - компонент для отображения одной новости в desktop режиме
function DesktopNewsCard({ item }: { item: NewsItem }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPredictionExpanded, setIsPredictionExpanded] = useState<boolean>(false);
  const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);
  const insets = useSafeAreaInsets();

  const handleNewsPress = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handlePredictionPress = useCallback(() => {
    setIsPredictionExpanded(true);
  }, []);

  const handlePredictionClose = useCallback(() => {
    setIsPredictionExpanded(false);
  }, []);

  const handleStockScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollViewWidth = SCREEN_WIDTH * 0.5 - 40;
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / scrollViewWidth);
    setCurrentStockIndex(index);
  }, []);

  return (
    <View style={styles.desktopNewsCardRow}>
      <View style={styles.desktopNewsCardLeft}>
        <TouchableOpacity 
          style={styles.desktopNewsWindow} 
          activeOpacity={0.95}
          onPress={handleNewsPress}
        >
          <View style={styles.newsCardContent}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.newsImage}
              resizeMode="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(12, 12, 12, 0.5)', 'rgba(12, 12, 12, 0.85)', 'rgba(12, 12, 12, 0.95)']}
              locations={[0.35, 0.5, 0.7, 1]}
              style={styles.newsGradientOverlay}
            >
              <View style={styles.newsTextContent}>
                <View style={styles.newsMeta}>
                  <Text style={styles.newsSource}>{item.source}</Text>
                  <Text style={styles.newsTimestamp}>{item.timestamp}</Text>
                </View>
                
                <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
                <Text style={styles.newsSnippet} numberOfLines={2}>{item.snippet}</Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.desktopNewsCardRight}>
        <View style={styles.desktopStocksWindow}>
          <View style={styles.stocksContent}>
            <Text style={styles.stocksTitle}>Related Stocks</Text>
            
            <ScrollView 
              horizontal 
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH * 0.5 - 40}
              snapToAlignment="center"
              onScroll={handleStockScroll}
              scrollEventThrottle={16}
            >
              {item.relatedStocks.map((stock, index) => (
                <View key={index} style={styles.desktopStockCard}>
                  <View style={styles.stockMainInfo}>
                    <Text style={styles.stockSymbolLarge}>{stock.symbol}</Text>
                    <Text style={styles.stockPriceLarge}>
                      ${stock.currentPrice.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={styles.priceChangeIconTopRight}>
                    {stock.priceChange > 0 ? (
                      <TrendingUp size={20} color={appColors.positive} />
                    ) : stock.priceChange < 0 ? (
                      <TrendingDown size={20} color={appColors.negative} />
                    ) : (
                      <Minus size={20} color={appColors.neutral} />
                    )}
                  </View>
                  
                  <Text
                    style={[
                      styles.stockChangeBottomRight,
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
            
            <View style={styles.paginationDots}>
              {item.relatedStocks.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor:
                        index === currentStockIndex
                          ? appColors.light
                          : appColors.neutral,
                      opacity: index === currentStockIndex ? 1 : 0.3,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.desktopPredictionWindow}
          activeOpacity={0.95}
          onPress={handlePredictionPress}
        >
          <View style={styles.predictionContent}>
            <Text style={styles.predictionTitle}>Impact Forecast</Text>
            
            <View style={styles.shortAnalysisContainer}>
              <View
                style={[
                  styles.sentimentBadgeSmall,
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
                <Text style={styles.sentimentTextSmall}>
                  {item.prediction.sentiment === 'positive'
                    ? 'POSITIVE'
                    : item.prediction.sentiment === 'negative'
                    ? 'NEGATIVE'
                    : 'NEUTRAL'}
                </Text>
              </View>
              
              <Text style={styles.shortAnalysisText} numberOfLines={4}>
                {item.prediction.shortAnalysis}
              </Text>
              
              <Text style={styles.tapForDetailsHint}>Tap for detailed forecast</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isExpanded}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.expandedContainer}>
          <View style={[styles.expandedTopSpacer, { height: insets.top + 20 }]} />
          
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.expandedNewsImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity style={[styles.closeButton, { top: insets.top + 30 }]} onPress={handleClose}>
            <X size={28} color={appColors.light} />
          </TouchableOpacity>
          
          <ScrollView style={styles.expandedScrollView} contentContainerStyle={styles.expandedContent}>
            <View style={styles.expandedNewsMeta}>
              <Text style={styles.expandedNewsSource}>{item.source}</Text>
              <Text style={styles.expandedNewsTimestamp}>{item.timestamp}</Text>
            </View>
            
            <Text style={styles.expandedNewsTitle}>{item.title}</Text>
            <Text style={styles.expandedNewsText}>{item.snippet}</Text>
            
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

      <Modal
        visible={isPredictionExpanded}
        animationType="slide"
        onRequestClose={handlePredictionClose}
      >
        <View style={styles.expandedContainer}>
          <View style={[styles.expandedTopSpacer, { height: insets.top + 20 }]} />
          
          <TouchableOpacity style={[styles.closeButton, { top: insets.top + 30 }]} onPress={handlePredictionClose}>
            <X size={28} color={appColors.light} />
          </TouchableOpacity>
          
          <ScrollView style={styles.expandedScrollView} contentContainerStyle={styles.expandedContent}>
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
  const insets = useSafeAreaInsets();

  // Обработчик изменения видимых элементов (onViewableItemsChanged)
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.index !== null) {
        console.log('Current visible news:', viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <View style={[styles.headerContainer, { top: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('./settings')}
          >
            <Settings size={24} color={appColors.light} />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>FINfeed</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('./profile')}
          >
            <User size={24} color={appColors.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.desktopContainer}>
          <FlatList
            ref={flatListRef}
            data={mockNewsData}
            renderItem={({ item }) => <DesktopNewsCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.desktopNewsList}
            contentContainerStyle={styles.desktopNewsListContent}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.headerContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('./settings')}
        >
          <Settings size={24} color={appColors.light} />
        </TouchableOpacity>
        
        <Text style={styles.appTitle}>FINfeed</Text>
        
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
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  appTitle: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
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
  newsGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  newsTextContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'flex-end',
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
    color: 'rgba(251, 251, 251, 0.6)',
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
    color: 'rgba(251, 251, 251, 0.8)',
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
    paddingTop: 12,
  },
  stocksTitle: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  stockCard: {
    width: SCREEN_WIDTH - 32,
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  stockMainInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  stockSymbolLarge: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '700' as const,
  },
  stockPriceLarge: {
    color: appColors.light,
    fontSize: 22,
    fontWeight: '600' as const,
  },
  priceChangeIconTopRight: {
    position: 'absolute',
    top: 0,
    right: 16,
  },
  stockChangeBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: -2,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  predictionWindow: {
    height: 220,
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
  shortAnalysisContainer: {
    flex: 1,
    gap: 12,
  },
  sentimentBadgeSmall: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sentimentTextSmall: {
    color: appColors.light,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  shortAnalysisText: {
    color: appColors.light,
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  tapForDetailsHint: {
    color: appColors.neutral,
    fontSize: 12,
    fontStyle: 'italic' as const,
    textAlign: 'center',
  },
  expandedContainer: {
    flex: 1,
    backgroundColor: appColors.dark,
  },
  expandedTopSpacer: {
    backgroundColor: appColors.dark,
  },
  expandedNewsImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.35,
  },
  closeButton: {
    position: 'absolute',
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
    paddingBottom: 60,
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
  desktopContainer: {
    flex: 1,
    paddingTop: 100,
  },
  desktopNewsList: {
    flex: 1,
  },
  desktopNewsListContent: {
    padding: 20,
  },
  desktopNewsCardRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    height: SCREEN_HEIGHT - 140,
  },
  desktopNewsCardLeft: {
    width: '50%',
  },
  desktopNewsCardRight: {
    flex: 1,
    gap: 20,
  },
  desktopNewsWindow: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: appColors.cardBg,
  },
  desktopStocksWindow: {
    flex: 0.4,
    borderRadius: 24,
    backgroundColor: appColors.cardBg,
    overflow: 'hidden',
  },
  desktopStockCard: {
    width: SCREEN_WIDTH * 0.5 - 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  desktopPredictionWindow: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: appColors.cardBg,
    overflow: 'hidden',
  },
});
