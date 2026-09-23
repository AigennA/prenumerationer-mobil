import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import PressableButton from "@/components/PressableButton";
import { colors } from "@/constants/colors";

type Props = {
  onAdd: (serviceName: string) => Promise<void>;
};

export default function NyPrenumerationForm({ onAdd }: Props) {
  const [serviceName, setServiceName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    if (serviceName.trim() === "") {
      setError("Ange ett namn.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onAdd(serviceName.trim());
      setServiceName("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={serviceName}
          onChangeText={setServiceName}
          placeholder="Ny tjänst, t.ex. Disney+"
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          editable={!saving}
        />
        <PressableButton title="Lägg till" onPress={handleAdd} disabled={saving} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
