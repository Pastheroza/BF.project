import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { User, TrendingUp, Bookmark, Clock, Award, Plus, Briefcase, X, BarChart3, AlertCircle, TrendingDown } from 'lucide-react-native';

// Цветовая палитра приложения (appColors)
const appColors = {
  dark: '#0c0c0c',
  light: '#fbfbfb',
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
  cardBg: '#1a1a1a',
} as const;

// PortfolioStock - тип данных для акции в портфолио
type PortfolioStock = {
  symbol: string;
  shares: number;
  avgPrice: number;
};

// ProfileScreen - экран профиля пользователя
// Отображает статистику и достижения пользователя
export default function ProfileScreen() {
  const [isPortfolioModalVisible, setIsPortfolioModalVisible] = useState<boolean>(false);
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState<boolean>(false);
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([
    { symbol: 'AAPL', shares: 10, avgPrice: 175.50 },
    { symbol: 'TSLA', shares: 5, avgPrice: 240.20 },
  ]);
  const [newStock, setNewStock] = useState<PortfolioStock>({
    symbol: '',
    shares: 0,
    avgPrice: 0,
  });

  const handleAddStock = () => {
    if (!newStock.symbol || newStock.shares <= 0 || newStock.avgPrice <= 0) {
      Alert.alert('Error', 'Please fill in all fields with valid values');
      return;
    }
    setPortfolioStocks([...portfolioStocks, newStock]);
    setNewStock({ symbol: '', shares: 0, avgPrice: 0 });
    setIsAddStockModalVisible(false);
  };

  const handleRemoveStock = (index: number) => {
    const updated = portfolioStocks.filter((_, i) => i !== index);
    setPortfolioStocks(updated);
  };

  return (
    <View style={styles.container}>
      {/* Настройка заголовка (headerConfig) */}
      <Stack.Screen
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: appColors.dark,
          },
          headerTintColor: appColors.light,
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scrollView}>
        {/* Аватар и имя пользователя (userHeader) */}
        <View style={styles.userHeader}>
          {/* Контейнер аватара (avatarContainer) */}
          <View style={styles.avatarContainer}>
            <User size={48} color={appColors.light} />
          </View>
          
          {/* Имя пользователя (userName) */}
          <Text style={styles.userName}>John Doe</Text>
          
          {/* Email пользователя (userEmail) */}
          <Text style={styles.userEmail}>john@example.com</Text>
        </View>

        {/* Секция статистики (statsSection) */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          {/* Контейнер карточек статистики (statsCards) */}
          <View style={styles.statsCards}>
            {/* Карточка: Прочитано новостей (readNewsCard) */}
            <View style={styles.statCard}>
              <Clock size={24} color={appColors.light} />
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>News Read</Text>
            </View>

            {/* Карточка: Сохранено (savedCard) */}
            <View style={styles.statCard}>
              <Bookmark size={24} color={appColors.light} />
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>

          <View style={styles.statsCards}>
            {/* Карточка: Точность прогнозов (accuracyCard) */}
            <View style={styles.statCard}>
              <TrendingUp size={24} color={appColors.light} />
              <Text style={styles.statValue}>78%</Text>
              <Text style={styles.statLabel}>Forecast Accuracy</Text>
            </View>

            {/* Карточка: Достижения (achievementsCard) */}
            <View style={styles.statCard}>
              <Award size={24} color={appColors.light} />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Секция интересов (interestsSection) */}
        <View style={styles.interestsSection}>
          <Text style={styles.sectionTitle}>Interests</Text>
          
          {/* Список интересов (interestsList) */}
          <View style={styles.interestsList}>
            <View style={styles.interestChip}>
              <Text style={styles.interestText}>Technology</Text>
            </View>
            <View style={styles.interestChip}>
              <Text style={styles.interestText}>Finance</Text>
            </View>
            <View style={styles.interestChip}>
              <Text style={styles.interestText}>Automotive</Text>
            </View>
            <View style={styles.interestChip}>
              <Text style={styles.interestText}>Health</Text>
            </View>
          </View>
        </View>

        {/* Секция портфолио (portfolioSection) */}
        <View style={styles.portfolioSection}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <TouchableOpacity 
              style={styles.portfolioButton}
              onPress={() => setIsPortfolioModalVisible(true)}
            >
              <Briefcase size={18} color={appColors.light} />
              <Text style={styles.portfolioButtonText}>Manage Portfolio</Text>
            </TouchableOpacity>
          </View>
          
          {/* Краткий обзор портфолио (portfolioPreview) */}
          <View style={styles.portfolioPreview}>
            <Text style={styles.portfolioPreviewText}>
              {portfolioStocks.length} stock{portfolioStocks.length !== 1 ? 's' : ''} tracked
            </Text>
          </View>
        </View>

        {/* Секция анализа портфолио (portfolioAnalysisSection) */}
        <View style={styles.portfolioAnalysisSection}>
          <View style={styles.analysisHeader}>
            <BarChart3 size={24} color={appColors.light} />
            <Text style={styles.sectionTitle}>Portfolio Analysis</Text>
          </View>
          
          {/* AI Insights (aiInsights) */}
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <TrendingUp size={20} color={appColors.positive} />
                <Text style={styles.insightTitle}>Positive Outlook</Text>
              </View>
              <Text style={styles.insightDescription}>
                Based on recent news, AAPL is expected to grow 12% in Q1 2025 due to strong iPhone demand and AI integration.
              </Text>
              <Text style={styles.insightTimestamp}>Updated 2 hours ago</Text>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <AlertCircle size={20} color='#f59e0b' />
                <Text style={styles.insightTitle}>Watch Closely</Text>
              </View>
              <Text style={styles.insightDescription}>
                TSLA facing regulatory challenges in EU markets. Consider monitoring production updates and earnings reports.
              </Text>
              <Text style={styles.insightTimestamp}>Updated 5 hours ago</Text>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <TrendingDown size={20} color={appColors.negative} />
                <Text style={styles.insightTitle}>Risk Alert</Text>
              </View>
              <Text style={styles.insightDescription}>
                Market volatility expected due to upcoming Fed interest rate decision. Portfolio may experience short-term fluctuations.
              </Text>
              <Text style={styles.insightTimestamp}>Updated 1 hour ago</Text>
            </View>
          </View>

          {/* Рекомендации (recommendations) */}
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationTitle}>AI Recommendations</Text>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                Consider diversifying into healthcare sector based on emerging biotech news
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                Rebalance portfolio: Current tech exposure at 85% vs recommended 60%
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                Set price alerts for TSLA at $250 resistance level
              </Text>
            </View>
          </View>
        </View>

        {/* Кнопка редактирования профиля (editProfileButton) */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно управления портфолио (portfolioModal) */}
      <Modal
        visible={isPortfolioModalVisible}
        animationType="slide"
        onRequestClose={() => setIsPortfolioModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>My Portfolio</Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsPortfolioModalVisible(false)}
            >
              <X size={24} color={appColors.light} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {portfolioStocks.map((stock, index) => (
              <View key={index} style={styles.portfolioStockCard}>
                <View style={styles.portfolioStockInfo}>
                  <Text style={styles.portfolioStockSymbol}>{stock.symbol}</Text>
                  <Text style={styles.portfolioStockDetails}>
                    {stock.shares} shares @ ${stock.avgPrice.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeStockButton}
                  onPress={() => handleRemoveStock(index)}
                >
                  <X size={20} color={appColors.negative} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.addStockButton}
            onPress={() => setIsAddStockModalVisible(true)}
          >
            <Plus size={20} color={appColors.dark} />
            <Text style={styles.addStockButtonText}>Add Stock</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Модальное окно добавления акции (addStockModal) */}
      <Modal
        visible={isAddStockModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsAddStockModalVisible(false)}
      >
        <View style={styles.addStockModalOverlay}>
          <View style={styles.addStockModalContent}>
            <Text style={styles.addStockModalTitle}>Add Stock</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Stock Symbol (e.g., AAPL)"
              placeholderTextColor={appColors.neutral}
              value={newStock.symbol}
              onChangeText={(text) => setNewStock({ ...newStock, symbol: text.toUpperCase() })}
              autoCapitalize="characters"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Number of Shares"
              placeholderTextColor={appColors.neutral}
              value={newStock.shares > 0 ? String(newStock.shares) : ''}
              onChangeText={(text) => setNewStock({ ...newStock, shares: parseFloat(text) || 0 })}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Average Price"
              placeholderTextColor={appColors.neutral}
              value={newStock.avgPrice > 0 ? String(newStock.avgPrice) : ''}
              onChangeText={(text) => setNewStock({ ...newStock, avgPrice: parseFloat(text) || 0 })}
              keyboardType="decimal-pad"
            />

            <View style={styles.addStockModalButtons}>
              <TouchableOpacity
                style={styles.addStockModalCancelButton}
                onPress={() => {
                  setIsAddStockModalVisible(false);
                  setNewStock({ symbol: '', shares: 0, avgPrice: 0 });
                }}
              >
                <Text style={styles.addStockModalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.addStockModalAddButton}
                onPress={handleAddStock}
              >
                <Text style={styles.addStockModalAddButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.dark,
  },
  scrollView: {
    flex: 1,
  },
  userHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: appColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  userName: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  userEmail: {
    color: appColors.neutral,
    fontSize: 16,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    color: appColors.light,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  statsCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: appColors.cardBg,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  statValue: {
    color: appColors.light,
    fontSize: 32,
    fontWeight: '600' as const,
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
  },
  interestsSection: {
    padding: 20,
    paddingTop: 0,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: appColors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  interestText: {
    color: appColors.light,
    fontSize: 14,
    fontWeight: '400' as const,
  },
  portfolioSection: {
    padding: 20,
    paddingTop: 0,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: appColors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  portfolioButtonText: {
    color: appColors.light,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  portfolioPreview: {
    backgroundColor: appColors.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  portfolioPreviewText: {
    color: appColors.neutral,
    fontSize: 14,
  },
  editButton: {
    margin: 20,
    backgroundColor: appColors.light,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: appColors.dark,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: appColors.dark,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  modalTitle: {
    color: appColors.light,
    fontSize: 24,
    fontWeight: '700' as const,
  },
  closeModalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  portfolioStockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  portfolioStockInfo: {
    flex: 1,
  },
  portfolioStockSymbol: {
    color: appColors.light,
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  portfolioStockDetails: {
    color: appColors.neutral,
    fontSize: 14,
  },
  removeStockButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${appColors.negative}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    backgroundColor: appColors.light,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addStockButtonText: {
    color: appColors.dark,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  addStockModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addStockModalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: appColors.cardBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  addStockModalTitle: {
    color: appColors.light,
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 20,
  },
  input: {
    backgroundColor: appColors.dark,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: appColors.light,
    fontSize: 16,
  },
  addStockModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  addStockModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  addStockModalCancelButtonText: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  addStockModalAddButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: appColors.light,
  },
  addStockModalAddButtonText: {
    color: appColors.dark,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  portfolioAnalysisSection: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insightsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: appColors.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  insightDescription: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  insightTimestamp: {
    color: appColors.neutral,
    fontSize: 12,
  },
  recommendationsContainer: {
    backgroundColor: appColors.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  recommendationTitle: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appColors.light,
    marginTop: 6,
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
});
