import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { API_BASE_URL, getPrenumerationer } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";
import PrenumerationCard from "@/components/PrenumerationCard";
import { colors } from "@/constants/colors";
import { getStatus } from "@/utils/status";


export default function Index() {
  const [prenumerationer, setPrenumerationer] = useState<Prenumeration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPrenumerationer()
      .then(setPrenumerationer)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.hint}>{API_BASE_URL}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={prenumerationer}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PrenumerationCard name={item.serviceName} note={item.note} status={getStatus(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
  },
  hint: {
    color: "#888",
  },
  list: {
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
});
