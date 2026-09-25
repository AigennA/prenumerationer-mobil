import { Pressable, StyleSheet, Text, View } from "react-native";

import Avatar from "@/components/Avatar";
import ProgressBar from "@/components/ProgressBar";
import StarRating from "@/components/StarRating";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/constants/colors";
import { getLogo } from "@/utils/logo";
import { Period } from "@/utils/period";
import { formatPrice } from "@/utils/price";
import { Status } from "@/utils/status";

type Props = {
  name: string;
  note: string | null;
  logoUrl: string | null;
  status: Status;
  period: Period | null;
  price: number | null;
  rating: number | null;
  onPress?: () => void;
};

export default function PrenumerationCard({ name, note, logoUrl, status, period, price, rating, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { borderLeftColor: colors[status] }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Avatar name={name} image={getLogo(name, logoUrl)} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.note} numberOfLines={1}>
          {note || " "}
        </Text>
        <StatusBadge status={status} />
      </View>
      {price !== null || period || rating !== null ? (
        <View style={styles.period}>
          {price !== null ? <Text style={styles.price}>{formatPrice(price)}</Text> : null}
          {period ? (
            <>
              <Text style={styles.periodText}>{period.text}</Text>
              <ProgressBar percent={period.percent} height={6} />
            </>
          ) : null}
          {rating !== null ? (
            <View style={styles.rating}>
              <StarRating value={rating} size={14} />
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 116,
    padding: 14,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: 14,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
    borderColor: colors.accent,
    transform: [{ scale: 0.98 }],
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
  price: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "right",
  },
  periodText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "right",
  },
  rating: {
    alignSelf: "flex-end",
  },
});
