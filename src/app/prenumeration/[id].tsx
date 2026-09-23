import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import ToggleSwitch from "@/components/ToggleSwitch";
import { colors } from "@/constants/colors";
import { getPrenumeration, updatePrenumeration } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";
import { getStatus, getToday } from "@/utils/status";

export default function PrenumerationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [prenumeration, setPrenumeration] = useState<Prenumeration | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getPrenumeration(Number(id))
      .then(setPrenumeration)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function handleToggle(isActive: boolean) {
    if (!prenumeration) return;
    const updated = {
      ...prenumeration,
      isActive,
      endDate: isActive ? null : getToday(),
    };
    setSaving(true);
    setSaveError("");
    try {
      await updatePrenumeration(updated);
      setPrenumeration(updated);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!prenumeration) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: prenumeration.serviceName }} />

      <View style={styles.header}>
        <Avatar name={prenumeration.serviceName} size={96} />
        <Text style={styles.name}>{prenumeration.serviceName}</Text>
        <StatusBadge status={getStatus(prenumeration)} />
      </View>

      <View style={styles.section}>
        <ToggleSwitch
          label="Aktiv prenumeration"
          value={prenumeration.isActive}
          onValueChange={handleToggle}
          disabled={saving}
        />
        {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Anteckning</Text>
        <Text style={styles.value}>{prenumeration.note || "Ingen anteckning"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Startdatum</Text>
        <Text style={styles.value}>{prenumeration.startDate ?? "Inte angivet"}</Text>
        <Text style={[styles.label, styles.spacing]}>Slutdatum</Text>
        <Text style={styles.value}>{prenumeration.endDate ?? "Pågående"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
  spacing: {
    marginTop: 12,
  },
  saveError: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 8,
  },
});
