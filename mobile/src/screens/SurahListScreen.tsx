import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuranStackParamList } from "../navigation/types";
import { QuranApi } from "../services/api";
import { Surah } from "../types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";
import { useDebounce } from "../hooks/useSearch";

type Props = NativeStackScreenProps<QuranStackParamList, "SurahList">;

export default function SurahListScreen({ navigation }: Props) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    QuranApi.getSurahs()
      .then(setSurahs)
      .catch(() => setError("Failed to load surahs"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = debouncedQuery.trim()
    ? surahs?.filter((s) => {
        const q = debouncedQuery.toLowerCase();
        return (
          s.name_mm.toLowerCase().includes(q) ||
          s.name_en.toLowerCase().includes(q) ||
          s.name_ar.includes(debouncedQuery) ||
          String(s.surah_number).includes(q)
        );
      })
    : surahs;

  const renderItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("AyahList", {
          surahId: item._id,
          surahName: item.name_mm,
          surahNumber: item.surah_number,
        })
      }
      activeOpacity={0.7}
    >
      {/* Number badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.surah_number}</Text>
      </View>

      {/* Names */}
      <View style={styles.info}>
        <Text style={styles.nameMm}>{item.name_mm}</Text>
        <Text style={styles.nameEn}>
          {item.name_en} · {item.totalAyah} ayah
        </Text>
      </View>

      {/* Arabic name */}
      <Text style={styles.nameAr}>{item.name_ar}</Text>
    </TouchableOpacity>
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
      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={COLORS.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="ရှာဖွေပါ... (နာမည်၊ နံပါတ်)"
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.emptyText}>ရလဒ်မတွေ့ပါ</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOW.card,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  list: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
  info: { flex: 1 },
  nameMm: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.text,
  },
  nameEn: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  nameAr: {
    fontFamily: FONTS.arabic,
    fontSize: 22,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  separator: { height: SPACING.sm },
  emptyText: {
    textAlign: "center",
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: COLORS.error,
  },
});
