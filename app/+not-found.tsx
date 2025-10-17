import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const appColors = {
  dark: '#0c0c0c',
  light: '#fbfbfb',
  positive: '#10b981',
} as const;

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Ошибка",
          headerStyle: { backgroundColor: appColors.dark },
          headerTintColor: appColors.light,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Этой страницы не существует</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Вернуться на главную</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: appColors.dark,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: appColors.light,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: appColors.positive,
  },
});
