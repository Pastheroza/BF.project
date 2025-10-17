import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { User, TrendingUp, Bookmark, Clock, Award } from 'lucide-react-native';

// Цветовая палитра приложения (appColors)
const appColors = {
  dark: '#0c0c0c',
  light: '#fbfbfb',
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
  cardBg: '#1a1a1a',
} as const;

// ProfileScreen - экран профиля пользователя
// Отображает статистику и достижения пользователя
export default function ProfileScreen() {
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

        {/* Кнопка редактирования профиля (editProfileButton) */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
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
});
