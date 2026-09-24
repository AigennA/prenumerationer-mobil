import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  name: string;
  size?: number;
  image?: ImageSourcePropType | null;
};

export default function Avatar({ name, size = 56, image }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.2 }]}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
      )}
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
    overflow: "hidden",
  },
  initials: {
    color: colors.accent,
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
