import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Globe, Shield, Info, LogOut, ChevronRight } from 'lucide-react-native';

// Цветовая палитра приложения (appColors)
const appColors = {
  dark: '#0c0c0c',
  light: '#fbfbfb',
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
  cardBg: '#1a1a1a',
} as const;

// SettingsScreen - экран настроек приложения
// Содержит различные настройки уведомлений, языка и безопасности
export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = React.useState<boolean>(true);

  return (
    <View style={styles.container}>
      {/* Настройка заголовка (headerConfig) */}
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: appColors.dark,
          },
          headerTintColor: appColors.light,
        }}
      />

      <ScrollView style={styles.scrollView}>
        {/* Секция уведомлений (notificationsSection) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {/* Настройка: Уведомления (notificationToggle) */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color={appColors.positive} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive notifications about new news
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: appColors.neutral, true: appColors.positive }}
              thumbColor={appColors.light}
            />
          </View>

          {/* Настройка: Ценовые оповещения (priceAlertsToggle) */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color={appColors.positive} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Price Alerts</Text>
                <Text style={styles.settingDescription}>
                  Alerts about significant price changes
                </Text>
              </View>
            </View>
            <Switch
              value={priceAlertsEnabled}
              onValueChange={setPriceAlertsEnabled}
              trackColor={{ false: appColors.neutral, true: appColors.positive }}
              thumbColor={appColors.light}
            />
          </View>
        </View>

        {/* Секция основных настроек (generalSection) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {/* Настройка: Язык (languageSetting) */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={24} color={appColors.positive} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>English</Text>
              </View>
            </View>
            <ChevronRight size={24} color={appColors.neutral} />
          </TouchableOpacity>

          {/* Настройка: Конфиденциальность (privacySetting) */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={24} color={appColors.positive} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingDescription}>
                  Data and security management
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color={appColors.neutral} />
          </TouchableOpacity>

          {/* Настройка: О приложении (aboutSetting) */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Info size={24} color={appColors.positive} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingDescription}>Version 1.0.0</Text>
              </View>
            </View>
            <ChevronRight size={24} color={appColors.neutral} />
          </TouchableOpacity>
        </View>

        {/* Кнопка выхода (logoutButton) */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={24} color={appColors.negative} />
          <Text style={styles.logoutText}>Sign Out</Text>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: appColors.light,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appColors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    color: appColors.light,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  settingDescription: {
    color: appColors.neutral,
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    backgroundColor: appColors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.negative,
    gap: 12,
  },
  logoutText: {
    color: appColors.negative,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
