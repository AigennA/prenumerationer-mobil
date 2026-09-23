import { StyleSheet, Switch, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function ToggleSwitch({ label, value, onValueChange, disabled }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.active }}
        thumbColor={colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
});
