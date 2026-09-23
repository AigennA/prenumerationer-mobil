import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import NyPrenumerationForm from "@/components/NyPrenumerationForm";
import PressableButton from "@/components/PressableButton";
import PrenumerationList from "@/components/PrenumerationList";
import { colors } from "@/constants/colors";
import { API_BASE_URL, createPrenumeration, getPrenumerationer } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";
import { getToday } from "@/utils/date";

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

  async function handleAdd(serviceName: string) {
    const created = await createPrenumeration({
      serviceName,
      note: null,
      startDate: getToday(),
      endDate: null,
      isActive: true,
    });
    setPrenumerationer([...prenumerationer, created]);
    router.push({ pathname: "/prenumeration/[id]", params: { id: String(created.id) } });
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
    <View style={styles.screen}>
      <NyPrenumerationForm onAdd={handleAdd} />
      <PrenumerationList
        prenumerationer={prenumerationer}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onSelect={(id) => router.push({ pathname: "/prenumeration/[id]", params: { id: String(id) } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
