import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import PressableButton from "@/components/PressableButton";
import PrenumerationList from "@/components/PrenumerationList";
import { colors } from "@/constants/colors";
import { API_BASE_URL, getPrenumerationer } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";

export default function Index() {
  const [prenumerationer, setPrenumerationer] = useState<Prenumeration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPrenumerationer = useCallback(async () => {
    setError("");
    try {
      setPrenumerationer(await getPrenumerationer());
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadPrenumerationer().finally(() => setIsLoading(false));
    }, [loadPrenumerationer])
  );

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadPrenumerationer();
    setIsRefreshing(false);
  }

  async function handleRetry() {
    setIsLoading(true);
    await loadPrenumerationer();
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.hint}>{API_BASE_URL}</Text>
        <PressableButton title="Försök igen" onPress={handleRetry} />
      </View>
    );
  }

  return (
    <PrenumerationList
      prenumerationer={prenumerationer}
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      onSelect={(id) => router.push({ pathname: "/prenumeration/[id]", params: { id: String(id) } })}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  hint: {
    color: colors.muted,
  },
});
