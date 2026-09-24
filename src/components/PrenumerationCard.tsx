import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Avatar from "@/components/Avatar";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/constants/colors";
import { Period } from "@/utils/period";
import { Status } from "@/utils/status";

type Props = {
  name: string;
  note: string | null;
  status: Status;
  period: Period | null;
  onPress?: () => void;
};

export default function PrenumerationCard({ name, note, status, period, onPress }: Props) {
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
      {period ? (
        <View style={styles.period}>
          <Text style={styles.periodText}>{period.text}</Text>
          <ProgressBar percent={period.percent} height={6} />
        </View>
      ) : null}
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
  period: {
    width: 110,
    gap: 6,
  },
  periodText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "right",
  },
});
