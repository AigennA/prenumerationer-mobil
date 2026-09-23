import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";
import { formatDate, parseDate } from "@/utils/date";

type Props = {
  label: string;
  value: string | null;
  placeholder: string;
  onChange: (value: string) => void;
  minimumDate?: string | null;
  maximumDate?: string | null;
  disabled?: boolean;
  onClear?: () => void;
};

export default function DateField({
  label,
  value,
  placeholder,
  onChange,
  minimumDate,
  maximumDate,
  disabled,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false);

  function handleValueChange(date: Date) {
    setOpen(false);
    onChange(formatDate(date));
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setOpen(!open)}
          disabled={disabled}
          accessibilityLabel={`Ändra ${label.toLowerCase()}`}
        >
          <Text style={styles.value}>{value ?? placeholder}</Text>
          <Ionicons name="calendar-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
        {value && onClear ? (
          <TouchableOpacity onPress={onClear} disabled={disabled} accessibilityLabel={`Ta bort ${label.toLowerCase()}`}>
            <Ionicons name="close-circle-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {open ? (
        <DateTimePicker
          value={value ? parseDate(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "spinner"}
          minimumDate={minimumDate ? parseDate(minimumDate) : undefined}
          maximumDate={maximumDate ? parseDate(maximumDate) : undefined}
          onValueChange={(_event, date) => handleValueChange(date)}
          onDismiss={() => setOpen(false)}
          themeVariant="dark"
          accentColor={colors.accent}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.muted,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  picker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
});
