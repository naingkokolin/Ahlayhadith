import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { GlobalSearchApi, QuranApi, HadithApi } from "../services/api";
import { SearchResult, SearchResultType } from "../types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";
import { useSearch } from "../hooks/useSearch";

type Props = NativeStackScreenProps<RootStackParamList, "GlobalSearch">;

type Filter = "all" | SearchResultType;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "အားလုံး", value: "all" },
  { label: "စူရာဟ်", value: "surah" },
  { label: "အာယာသ်", value: "ayah" },
  { label: "ဟဒီးဆ်", value: "hadith" },
];

const TYPE_ICON: Record<SearchResultType, keyof typeof Ionicons.glyphMap> = {
  surah: "book-outline",
  ayah: "document-text-outline",
  hadith: "library-outline",
};

const TYPE_COLOR: Record<SearchResultType, string> = {
  surah: COLORS.primary,
  ayah: COLORS.primary,
  hadith: COLORS.secondary,
};

export default function GlobalSearchScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const searchFn = (q: string) => {
    if (activeFilter === "surah" || activeFilter === "ayah")
      return QuranApi.search(q);
    if (activeFilter === "hadith") return HadithApi.search(q);
    return GlobalSearchApi.search(q);
  };

  const { query, setQuery, results, loading, error, clear } =
    useSearch<SearchResult>(searchFn);

  const filtered =
    activeFilter === "all"
      ? results
      : results.filter((r) => r.type === activeFilter);

  const handleResultPress = (item: SearchResult) => {
    if (item.type === "surah" && item.surahId) {
      navigation.navigate("QuranStack", {
        screen: "AyahList",
        params: {
          surahId: item.surahId,
          surahName: item.title,
          surahNumber: parseInt(item.subtitle),
        },
      });
    } else if (item.type === "ayah" && item.surahId) {
      navigation.navigate("QuranStack", {
        screen: "AyahList",
        params: {
          surahId: item.surahId,
          surahName: item.title,
          surahNumber: 0,
        },
      });
    } else if (item.type === "hadith" && item.chapterId) {
      navigation.navigate("HadithStack", {
        screen: "HadithList",
        params: {
          chapterId: item.chapterId,
          chapterName: item.title,
          bookName: item.subtitle,
        },
      });
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => {
    const color = TYPE_COLOR[item.type];
    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => handleResultPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.typeIcon, { backgroundColor: color + "20" }]}>
          <Ionicons name={TYPE_ICON[item.type]} size={18} color={color} />
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
          {item.highlight ? (
            <Text style={styles.resultHighlight} numberOfLines={2}>
              {item.highlight}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Search bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
            <TextInput
              autoFocus
              style={styles.searchInput}
              placeholder="ရှာဖွေပါ..."
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clear}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterChip,
                activeFilter === f.value && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === f.value && styles.filterLabelActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : query.trim() === "" ? (
          <View style={styles.center}>
            <Ionicons name="search" size={48} color={COLORS.border} />
            <Text style={styles.hintText}>စာလုံးများ ရိုက်ထည့်ပါ</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => (
              <View style={{ height: SPACING.sm }} />
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>ရလဒ်မတွေ့ပါ</Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xxl,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  backBtn: { padding: 4 },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOW.card,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  filterLabelActive: {
    color: "#fff",
    fontFamily: FONTS.bold,
  },
  list: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  resultCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  typeIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  resultInfo: { flex: 1 },
  resultTitle: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text },
  resultSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  resultHighlight: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.text,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  hintText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  errorText: { fontFamily: FONTS.regular, color: COLORS.error },
});
