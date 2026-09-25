import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  value: number | null;
  onChange?: (value: number | null) => void;
  max?: number;
  size?: number;
};

export default function StarRating({ value, onChange, max = 5, size = 28 }: Props) {
  const rating = value ?? 0;

  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange?.(i + 1 === rating ? null : i + 1)}
          disabled={!onChange}
          accessibilityLabel={`${i + 1} av ${max} stjärnor`}
        >
          <Text style={{ fontSize: size, color: i < rating ? colors.accent : colors.border }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
  },
});
