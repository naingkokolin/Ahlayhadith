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
import { HadithStackParamList } from "../navigation/types";
import { HadithApi } from "../services/api";
import { HadithChapter } from "../types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";
import { useDebounce } from "../hooks/useSearch";

type Props = NativeStackScreenProps<HadithStackParamList, "HadithChapters">;

export default function HadithChaptersScreen({ route, navigation }: Props) {
  const { bookId } = route.params;
  const [chapters, setChapters] = useState<HadithChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // useEffect(() => {
  //   HadithApi.getChapters()
  //     .then(setChapters)
  //     .catch(() => setError("Failed to load chapters"))
  //     .finally(() => setLoading(false));
  // }, [bookId]);

  useEffect(() => {
    HadithApi.getChaptersByBook(bookId)
      .then(setChapters)
      .catch(() => setError("Failed to load chapters"))
      .finally(() => setLoading(false));
  }, [bookId]);

  const filtered = debouncedQuery.trim()
    ? chapters.filter((c) => {
        const q = debouncedQuery.toLowerCase();
        return (
          c.name_mm.toLowerCase().includes(q) ||
          c.name_en.toLowerCase().includes(q) ||
          c.name_ar.includes(debouncedQuery) ||
          String(c.chapter_number).includes(q)
        );
      })
    : chapters;

  const renderItem = ({ item }: { item: HadithChapter }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("HadithList", {
          chapterId: item._id,
          chapterName: item.name_mm,
          bookName: route.params.bookName,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.chapter_number}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nameMm}>{item.name_mm}</Text>
        <Text style={styles.nameEn}>
          {item.name_en} · {item.totalHadith} ဟဒီးဆ်
        </Text>
      </View>
      <Text style={styles.nameAr}>{item.name_ar}</Text>
    </TouchableOpacity>
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
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={COLORS.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="အခန်းရှာဖွေပါ..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
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
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
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
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  badgeText: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.secondary },
  info: { flex: 1 },
  nameMm: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text },
  nameEn: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  nameAr: {
    fontFamily: FONTS.arabic,
    fontSize: 18,
    color: COLORS.secondary,
    marginLeft: SPACING.sm,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
  errorText: { fontFamily: FONTS.regular, color: COLORS.error },
});
