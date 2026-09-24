import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity } from "react-native";

import PrenumerationCard from "@/components/PrenumerationCard";
import { colors } from "@/constants/colors";
import { Prenumeration } from "@/types/prenumeration";
import { getPeriod } from "@/utils/period";
import { getStatus } from "@/utils/status";

const VISIBLE_COUNT = 5;

type Props = {
  prenumerationer: Prenumeration[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelect: (id: number) => void;
};

export default function PrenumerationList({ prenumerationer, isRefreshing, onRefresh, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = prenumerationer.length - VISIBLE_COUNT;
  const visible = expanded ? prenumerationer : prenumerationer.slice(0, VISIBLE_COUNT);

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={visible}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PrenumerationCard
          name={item.serviceName}
          note={item.note}
          logoUrl={item.logoUrl}
          status={getStatus(item)}
          period={getPeriod(item)}
          onPress={() => onSelect(item.id)}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      ListEmptyComponent={<Text style={styles.empty}>Inga prenumerationer ännu.</Text>}
      ListFooterComponent={
        hiddenCount > 0 ? (
          <TouchableOpacity style={styles.more} onPress={() => setExpanded(!expanded)}>
            <Text style={styles.moreText}>{expanded ? "Visa färre" : `Visa fler (${hiddenCount})`}</Text>
            <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.accent} />
          </TouchableOpacity>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 40,
  },
  more: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  moreText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "600",
  },
});
