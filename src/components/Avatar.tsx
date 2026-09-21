import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  name: string;
  size?: number;
};

export default function Avatar({ name, size = 56 }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  initials: {
    color: colors.accent,
    fontWeight: "700",
  },
});
