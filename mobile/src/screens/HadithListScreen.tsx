import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  // SafeAreaView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HadithStackParamList } from "../navigation/types";
import { HadithApi } from "../services/api";
import { Hadith } from "../types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";

type Props = NativeStackScreenProps<HadithStackParamList, "HadithList">;

export default function HadithListScreen({ route }: Props) {
  const { chapterId, bookName } = route.params;
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   HadithApi.getHadiths()
  //     .then(setHadiths)
  //     .catch(() => setError("Failed to load hadiths"))
  //     .finally(() => setLoading(false));
  // }, [chapterId]);

  // const { chapterId } = route.params;

  useEffect(() => {
    HadithApi.getHadithsByChapter(chapterId)
      .then(setHadiths)
      .catch(() => setError("Failed to load hadiths"))
      .finally(() => setLoading(false));
  }, [chapterId]);

  const renderItem = ({ item }: { item: Hadith }) => (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberLabel}>ဟဒီး</Text>
          <Text style={styles.numberValue}>{item.hadith_number}</Text>
        </View>
        <Text style={styles.bookName}>{bookName}</Text>
        <View
          style={[
            styles.gradeBadge,
            item.grade === "Sahih" && styles.gradeGreen,
          ]}
        >
          <Text style={styles.gradeText}>{item.grade}</Text>
        </View>
      </View>

      {/* Arabic text */}
      <Text style={styles.arabicText}>{item.text_ar}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Myanmar translation */}
      <Text style={styles.mmText}>{item.text_mm}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
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
        data={hadiths}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  numberBadge: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    alignItems: "center",
  },
  numberLabel: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.secondary,
  },
  numberValue: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.secondary,
  },
  bookName: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  gradeBadge: {
    backgroundColor: "#E5E7EB",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  gradeGreen: { backgroundColor: COLORS.primaryLight },
  gradeText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.primary,
  },
  arabicText: {
    fontFamily: FONTS.arabic,
    fontSize: 22,
    color: COLORS.text,
    textAlign: "right",
    lineHeight: 40,
    writingDirection: "rtl",
    marginBottom: SPACING.sm,
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
  errorText: { fontFamily: FONTS.regular, color: COLORS.error },
});
