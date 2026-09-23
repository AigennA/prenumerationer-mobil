import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/constants/colors";
import { Status } from "@/utils/status";

type Props = {
  name: string;
  note: string | null;
  status: Status;
  onPress?: () => void;
};

export default function PrenumerationCard({ name, note, status, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: colors[status] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar name={name} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.note}>{note || " "}</Text>
        <StatusBadge status={status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: 14,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  note: {
    color: colors.muted,
    fontSize: 14,
  },
});
