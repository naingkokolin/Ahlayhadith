import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HadithStackParamList } from "../navigation/types";
import { HadithApi } from "../services/api";
import { HadithBook } from "../types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";

type Props = NativeStackScreenProps<HadithStackParamList, "HadithBooks">;

const BOOK_COLORS = [
  "#1B6B4A", // Bukhari — green
  "#8B4513", // Muslim — brown
  "#1A3A6B", // Abu Dawud — navy
  "#6B1A1A", // Tirmidhi — maroon
];

export default function HadithBooksScreen({ route, navigation }: Props) {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { bibleId } = route.params;

  // useEffect(() => {
  //   HadithApi.getBooks()
  //     .then(setBooks)
  //     .catch(() => setError("Failed to load books"))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    HadithApi.getBooksByBible(bibleId)
      .then(setBooks)
      .catch(() => setError("Something wrong! Failed to load books"))
      .finally(() => setLoading(false));
  }, [bibleId]);

  const renderItem = ({ item, index }: { item: HadithBook; index: number }) => {
    const color = BOOK_COLORS[index % BOOK_COLORS.length];
    return (
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: color }]}
        onPress={() =>
          navigation.navigate("HadithChapters", {
            bookId: item._id,
            bookName: item.name_mm,
          })
        }
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
          <Ionicons name="book" size={28} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.nameAr}>{item.name_ar}</Text>
          <Text style={styles.nameMm}>{item.name_mm}</Text>
          {/* <Text style={styles.meta}>
            {item.author} · {item.totalHadith} ဟဒီး
          </Text> */}
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

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
        data={books}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    ...SHADOW.card,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  info: { flex: 1 },
  nameAr: {
    fontFamily: FONTS.arabic,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 2,
  },
  nameMm: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.text,
  },
  meta: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  errorText: { fontFamily: FONTS.regular, color: COLORS.error },
});
