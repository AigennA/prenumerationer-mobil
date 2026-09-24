import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import Avatar from "@/components/Avatar";
import DateField from "@/components/DateField";
import PressableButton from "@/components/PressableButton";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import ToggleSwitch from "@/components/ToggleSwitch";
import { colors } from "@/constants/colors";
import { getFileUrl, getPrenumeration, updatePrenumeration } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";
import { getToday } from "@/utils/date";
import { getLogo } from "@/utils/logo";
import { getPeriod } from "@/utils/period";
import { getStatus } from "@/utils/status";

function getEndDate(prenumeration: Prenumeration) {
  const today = getToday();
  if (prenumeration.endDate && prenumeration.endDate < today) return prenumeration.endDate;
  if (prenumeration.startDate && prenumeration.startDate > today) return prenumeration.startDate;
  return today;
}

function getActiveEndDate(prenumeration: Prenumeration) {
  if (prenumeration.endDate && prenumeration.endDate >= getToday()) return prenumeration.endDate;
  return null;
}

export default function PrenumerationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [prenumeration, setPrenumeration] = useState<Prenumeration | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    getPrenumeration(Number(id))
      .then((data) => {
        setPrenumeration(data);
        setServiceName(data.serviceName);
        setNote(data.note ?? "");
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function save(updated: Prenumeration) {
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

  function handleToggle(isActive: boolean) {
    if (!prenumeration) return;
    save({
      ...prenumeration,
      isActive,
      endDate: isActive ? getActiveEndDate(prenumeration) : getEndDate(prenumeration),
    });
  }

  function handleTextSave() {
    if (!prenumeration) return;
    const trimmedName = serviceName.trim();
    if (trimmedName === "") {
      setSaveError("Namnet får inte vara tomt.");
      return;
    }
    const trimmedNote = note.trim();
    if (trimmedName === prenumeration.serviceName && trimmedNote === (prenumeration.note ?? "")) return;
    setServiceName(trimmedName);
    setNote(trimmedNote);
    save({ ...prenumeration, serviceName: trimmedName, note: trimmedNote || null });
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

  const textChanged =
    serviceName.trim() !== prenumeration.serviceName || note.trim() !== (prenumeration.note ?? "");
  const period = getPeriod(prenumeration);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: prenumeration.serviceName }} />

      <View style={styles.header}>
        <Avatar
          name={prenumeration.serviceName}
          size={96}
          image={getLogo(prenumeration.serviceName, prenumeration.logoUrl)}
        />
        <Text style={styles.name}>{prenumeration.serviceName}</Text>
        <StatusBadge status={getStatus(prenumeration)} />
      </View>

      {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}

      <View style={styles.section}>
        <ToggleSwitch
          label="Aktiv prenumeration"
          value={prenumeration.isActive}
          onValueChange={handleToggle}
          disabled={saving}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Namn</Text>
        <TextInput
          style={styles.input}
          value={serviceName}
          onChangeText={setServiceName}
          onSubmitEditing={handleTextSave}
          returnKeyType="done"
          editable={!saving}
        />
        <Text style={[styles.label, styles.spacing]}>Anteckning</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          onSubmitEditing={handleTextSave}
          placeholder="Ingen anteckning"
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          editable={!saving}
        />
        <View style={styles.spacing}>
          <PressableButton
            title={saving ? "Sparar..." : "Spara ändringar"}
            onPress={handleTextSave}
            disabled={!textChanged || saving}
          />
        </View>
      </View>

      <View style={styles.section}>
        <DateField
          label="Startdatum"
          value={prenumeration.startDate}
          placeholder="Inte angivet"
          maximumDate={prenumeration.endDate}
          onChange={(startDate) => save({ ...prenumeration, startDate })}
          disabled={saving}
        />
        <View style={styles.spacing}>
          <DateField
            label="Slutdatum"
            value={prenumeration.endDate}
            placeholder="Pågående"
            minimumDate={prenumeration.startDate}
            onChange={(endDate) => save({ ...prenumeration, endDate, isActive: endDate >= getToday() })}
            onClear={() => save({ ...prenumeration, endDate: null, isActive: true })}
            disabled={saving}
          />
        </View>
        {period ? (
          <View style={styles.progress}>
            <ProgressBar percent={period.percent} />
            <Text style={styles.label}>{period.text}</Text>
          </View>
        ) : null}
      </View>

      {prenumeration.documentUrl ? (
        <View style={styles.section}>
          <Text style={styles.label}>Dokument</Text>
          <TouchableOpacity
            style={styles.document}
            onPress={() => Linking.openURL(getFileUrl(prenumeration.documentUrl!))}
          >
            <Ionicons name="document-text-outline" size={20} color={colors.accent} />
            <Text style={styles.documentName}>{prenumeration.documentName ?? "Öppna dokument"}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 16,
  },
  spacing: {
    marginTop: 12,
  },
  progress: {
    marginTop: 16,
    gap: 8,
  },
  saveError: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 8,
  },
    document: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  documentName: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },

});
