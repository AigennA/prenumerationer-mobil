import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Avatar from "@/components/Avatar";
import DateField from "@/components/DateField";
import PressableButton from "@/components/PressableButton";
import ProgressBar from "@/components/ProgressBar";
import StarRating from "@/components/StarRating";
import StatusBadge from "@/components/StatusBadge";
import ToggleSwitch from "@/components/ToggleSwitch";
import { colors } from "@/constants/colors";
import { getLocalData, LocalData, saveLocalData } from "@/services/localData";
import { getFileUrl, getPrenumeration, updatePrenumeration, uploadDocument, uploadLogo } from "@/services/prenumerationApi";
import { Prenumeration } from "@/types/prenumeration";
import { getToday } from "@/utils/date";
import { getLogo } from "@/utils/logo";
import { getPeriod } from "@/utils/period";
import { formatAmount, getPaymentCount } from "@/utils/price";
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

function parsePrice(value: string) {
  if (value.trim() === "") return null;
  return Number(value.replace(",", "."));
}

export default function PrenumerationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [prenumeration, setPrenumeration] = useState<Prenumeration | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [localData, setLocalData] = useState<LocalData>({ price: null, rating: null });
  const [price, setPrice] = useState("");

  useEffect(() => {
    getPrenumeration(Number(id))
      .then((data) => {
        setPrenumeration(data);
        setServiceName(data.serviceName);
        setNote(data.note ?? "");
      })
      .catch((err: Error) => setError(err.message));
    getLocalData(Number(id)).then((data) => {
      setLocalData(data);
      setPrice(data.price === null ? "" : String(data.price));
    });
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

  async function handleTextSave() {
    if (!prenumeration) return;
    const trimmedName = serviceName.trim();
    if (trimmedName === "") {
      setSaveError("Namnet får inte vara tomt.");
      return;
    }
    const newPrice = parsePrice(price);
    if (newPrice !== null && (Number.isNaN(newPrice) || newPrice < 0)) {
      setSaveError("Ange ett giltigt pris.");
      return;
    }
    const trimmedNote = note.trim();
    setServiceName(trimmedName);
    setNote(trimmedNote);
    setSaveError("");

    if (newPrice !== localData.price) {
      const updated = { ...localData, price: newPrice };
      await saveLocalData(prenumeration.id, updated);
      setLocalData(updated);
    }
    if (trimmedName !== prenumeration.serviceName || trimmedNote !== (prenumeration.note ?? "")) {
      await save({ ...prenumeration, serviceName: trimmedName, note: trimmedNote || null });
    }
  }

  async function handleRating(rating: number | null) {
    if (!prenumeration) return;
    const updated = { ...localData, rating };
    await saveLocalData(prenumeration.id, updated);
    setLocalData(updated);
  }

  async function upload(send: () => Promise<Prenumeration>) {
    setUploading(true);
    setSaveError("");
    try {
      setPrenumeration(await send());
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handlePickLogo() {
    if (!prenumeration) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? "image/jpeg";
    await upload(() =>
      uploadLogo(prenumeration.id, {
        uri: asset.uri,
        name: asset.fileName ?? `logga.${mimeType.split("/")[1]}`,
        mimeType,
        file: asset.file,
      })
    );
  }

  async function handlePickDocument() {
    if (!prenumeration) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    await upload(() =>
      uploadDocument(prenumeration.id, {
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? "application/octet-stream",
        file: asset.file,
      })
    );
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
    serviceName.trim() !== prenumeration.serviceName ||
    note.trim() !== (prenumeration.note ?? "") ||
    parsePrice(price) !== localData.price;
  const period = getPeriod(prenumeration);
  const logo = getLogo(prenumeration.serviceName, prenumeration.logoUrl);
  const paymentCount = getPaymentCount(prenumeration);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: prenumeration.serviceName }} />

      <Modal visible={showLogo} transparent animationType="fade" onRequestClose={() => setShowLogo(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowLogo(false)}>
          {logo ? <Image source={logo} style={styles.largeLogo} /> : null}
        </Pressable>
      </Modal>

      <View style={styles.header}>
        <View style={uploading ? styles.uploading : undefined}>
          <TouchableOpacity
            onPress={logo ? () => setShowLogo(true) : handlePickLogo}
            disabled={uploading}
            accessibilityLabel={logo ? "Visa logga" : "Ladda upp logga"}
          >
            <Avatar name={prenumeration.serviceName} size={96} image={logo} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraBadge}
            onPress={handlePickLogo}
            disabled={uploading}
            accessibilityLabel="Byt logga"
          >
            <Ionicons name="camera" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.label}>Betyg</Text>
        <StarRating value={localData.rating} onChange={handleRating} />
        <Text style={styles.hint}>Tryck på en stjärna för att sätta betyg. Betyget sparas bara på den här telefonen.</Text>
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
        <Text style={[styles.label, styles.spacing]}>Pris (kr/mån)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          onSubmitEditing={handleTextSave}
          placeholder="Inget pris"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          returnKeyType="done"
          editable={!saving}
        />
        <Text style={styles.hint}>Priset sparas bara på den här telefonen.</Text>
        {localData.price !== null ? (
          <Text style={styles.paid}>
            {paymentCount > 0
              ? `Hittills betalt ca ${formatAmount(localData.price * paymentCount)} (${paymentCount} ${
                  paymentCount === 1 ? "betalning" : "betalningar"
                })`
              : "Ingen betalning ännu"}
          </Text>
        ) : null}
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

      <View style={styles.section}>
        <Text style={styles.label}>Dokument</Text>
        {prenumeration.documentUrl ? (
          <TouchableOpacity
            style={styles.document}
            onPress={() => Linking.openURL(getFileUrl(prenumeration.documentUrl!))}
          >
            <Ionicons name="document-text-outline" size={20} color={colors.accent} />
            <Text style={styles.documentName}>{prenumeration.documentName ?? "Öppna dokument"}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>Inget dokument uppladdat</Text>
        )}
        <View style={styles.spacing}>
          <PressableButton
            title={prenumeration.documentUrl ? "Byt dokument" : "Ladda upp dokument"}
            onPress={handlePickDocument}
            disabled={uploading}
          />
        </View>
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
    color: colors.muted,
    fontSize: 15,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  paid: {
    color: colors.text,
    fontSize: 14,
    marginTop: 8,
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
    uploading: {
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  largeLogo: {
    width: 160,
    height: 160,
    borderRadius: 20,
  },
  cameraBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.background,
  },


});

