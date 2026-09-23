import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";

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
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
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
    fontSize: 18,
    fontWeight: "700",
  },
});
