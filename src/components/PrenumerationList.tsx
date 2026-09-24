import { FlatList, RefreshControl, StyleSheet, Text } from "react-native";

import PrenumerationCard from "@/components/PrenumerationCard";
import { colors } from "@/constants/colors";
import { Prenumeration } from "@/types/prenumeration";
import { getStatus } from "@/utils/status";

type Props = {
  prenumerationer: Prenumeration[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelect: (id: number) => void;
};

export default function PrenumerationList({ prenumerationer, isRefreshing, onRefresh, onSelect }: Props) {
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={prenumerationer}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PrenumerationCard
          name={item.serviceName}
          note={item.note}
          status={getStatus(item)}
          onPress={() => onSelect(item.id)}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      ListEmptyComponent={<Text style={styles.empty}>Inga prenumerationer ännu.</Text>}
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
});
