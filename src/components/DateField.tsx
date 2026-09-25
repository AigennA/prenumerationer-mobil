import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CSSProperties, useState } from "react";
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
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={value ?? ""}
            min={minimumDate ?? undefined}
            max={maximumDate ?? undefined}
            disabled={disabled}
            aria-label={`Ändra ${label.toLowerCase()}`}
            onChange={(event) => event.target.value && onChange(event.target.value)}
            style={webDateInput}
          />
        ) : (
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setOpen(!open)}
            disabled={disabled}
            accessibilityLabel={`Ändra ${label.toLowerCase()}`}
          >
            <Text style={styles.value}>{value ?? placeholder}</Text>
            <Ionicons name="calendar-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
        )}
        {value && onClear ? (
          <TouchableOpacity onPress={onClear} disabled={disabled} accessibilityLabel={`Ta bort ${label.toLowerCase()}`}>
            <Ionicons name="close-circle-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {open && Platform.OS !== "web" ? (
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

const webDateInput: CSSProperties = {
  flex: 1,
  padding: "4px 0",
  border: "none",
  background: "transparent",
  color: colors.text,
  fontSize: 16,
  colorScheme: "dark",
};

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
