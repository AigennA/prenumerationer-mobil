import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from "react-native";

import NyPrenumerationForm from "@/components/NyPrenumerationForm";
import PressableButton from "@/components/PressableButton";
import PrenumerationList from "@/components/PrenumerationList";
import SearchField from "@/components/SearchField";
import { colors } from "@/constants/colors";
import { getAllLocalData, LocalData } from "@/services/localData";
import { API_BASE_URL, createPrenumeration, getPrenumerationer } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";
import { getToday } from "@/utils/date";
import { formatAmount, formatPrice, getPaidSoFar } from "@/utils/price";
import { getStatus } from "@/utils/status";

export default function Index() {
  const [prenumerationer, setPrenumerationer] = useState<Prenumeration[]>([]);
  const [localData, setLocalData] = useState<Record<number, LocalData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadPrenumerationer = useCallback(async () => {
    setError("");
    try {
      const items = await getPrenumerationer();
      setLocalData(await getAllLocalData(items.map((item) => item.id)));
      setPrenumerationer(items);
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

  const query = search.trim().toLowerCase();
  const filtered = query
    ? prenumerationer.filter((item) => `${item.serviceName} ${item.note ?? ""}`.toLowerCase().includes(query))
    : prenumerationer;

  const prices: Record<number, number | null> = Object.fromEntries(
    prenumerationer.map((item) => [item.id, localData[item.id]?.price ?? null])
  );
  const priced = prenumerationer.filter((item) => prices[item.id] != null);
  const active = priced.filter((item) => getStatus(item) === "active");
  const upcoming = priced.filter((item) => getStatus(item) === "pending");
  const activeTotal = active.reduce((sum, item) => sum + prices[item.id]!, 0);
  const upcomingTotal = upcoming.reduce((sum, item) => sum + prices[item.id]!, 0);
  const paidTotal = priced.reduce((sum, item) => sum + getPaidSoFar(item, prices[item.id]!), 0);

  return (
    <View style={[styles.screen, Platform.OS === "web" && styles.webScreen]}>
      <Image source={require("@/assets/images/logo.png")} style={styles.watermark} />
      <NyPrenumerationForm onAdd={handleAdd} />
      {priced.length > 0 ? (
        <View style={styles.summary}>
          {active.length > 0 ? (
            <Text style={styles.total}>
              Totalt <Text style={styles.totalValue}>{formatPrice(activeTotal)}</Text> för aktiva prenumerationer
            </Text>
          ) : null}
          {upcoming.length > 0 ? (
            <Text style={styles.total}>
              Kommande <Text style={styles.totalValue}>{formatPrice(upcomingTotal)}</Text>
            </Text>
          ) : null}
          {paidTotal > 0 ? (
            <Text style={styles.total}>
              Hittills betalt ca <Text style={styles.totalValue}>{formatAmount(paidTotal)}</Text>
            </Text>
          ) : null}
        </View>
      ) : null}
      <SearchField value={search} onChangeText={setSearch} />
      <PrenumerationList
        prenumerationer={filtered}
        localData={localData}
        emptyText={query ? "Inga prenumerationer matchar sökningen." : "Inga prenumerationer ännu."}
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
  webScreen: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  watermark: {
    position: "absolute",
    alignSelf: "center",
    bottom: 80,
    width: 220,
    height: 220,
    opacity: 0.06,
    pointerEvents: "none",
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
  summary: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 2,
  },
  total: {
    color: colors.muted,
    fontSize: 14,
  },
  totalValue: {
    color: colors.accent,
    fontWeight: "700",
  },
});
