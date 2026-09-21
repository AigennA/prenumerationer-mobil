import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PressableButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});
