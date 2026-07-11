import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuranStackParamList } from "../navigation/types";
import { QuranApi } from "../services/api";
import { Ayah } from "../types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";

type Props = NativeStackScreenProps<QuranStackParamList, "AyahList">;

export default function AyahListScreen({ route }: Props) {
  const { surahId } = route.params;
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    QuranApi.getAyahs(surahId)
      .then(setAyahs)
      .catch(() => setError("Failed to load ayahs"))
      .finally(() => setLoading(false));
  }, [surahId]);

  const renderItem = ({ item }: { item: Ayah }) => (
    <View style={styles.card}>
      {/* Ayah number + Arabic */}
      <View style={styles.arabicRow}>
        <View style={styles.ayahBadge}>
          <Text style={styles.ayahNumber}>{item.ayah_number}</Text>
        </View>
        <Text style={styles.arabicText}>{item.text_ar}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Myanmar translation */}
      <Text style={styles.mmText}>{item.text_mm}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={ayahs}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  arabicRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  ayahBadge: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    flexShrink: 0,
  },
  ayahNumber: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.primary,
  },
  arabicText: {
    flex: 1,
    fontFamily: FONTS.arabic,
    fontSize: 24,
    color: COLORS.text,
    textAlign: "right",
    lineHeight: 42,
    writingDirection: "rtl",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  mmText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 24,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: COLORS.error,
  },
});
