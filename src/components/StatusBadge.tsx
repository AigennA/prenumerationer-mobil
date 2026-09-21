import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Status } from "@/utils/status";

const labels: Record<Status, string> = {
  active: "Aktiv",
  pending: "Kommande",
  inactive: "Avslutad",
};

type Props = {
  status: Status;
};

export default function StatusBadge({ status }: Props) {
  return (
    <View style={[styles.badge, { borderColor: colors[status], backgroundColor: `${colors[status]}29` }]}>
      <Text style={[styles.text, { color: colors[status] }]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
