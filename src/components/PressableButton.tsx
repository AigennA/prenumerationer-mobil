import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PressableButton({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});
