import { Lobster_400Regular, useFonts } from "@expo-google-fonts/lobster";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

function AppTitle() {
  return (
    <View style={styles.title}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.titleText}>Prenumerationskollen</Text>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Lobster_400Regular });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          headerTitleAlign: Platform.OS === "web" ? "center" : "left",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: () => <AppTitle /> }} />
        <Stack.Screen name="prenumeration/[id]" options={{ title: "", headerBackTitle: "Tillbaka" }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
  titleText: {
    color: colors.text,
    fontFamily: "Lobster_400Regular",
    fontSize: 22,
  },
});
