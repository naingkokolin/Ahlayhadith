import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/types";
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from "../constants/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ahlayhadith 2026</Text>
          <Text style={styles.subtitle}>Quran & Hadith Myanmar</Text>
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate("GlobalSearch")}
        >
          <Ionicons name="search" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Bismillah banner */}
      <View style={styles.bismillahCard}>
        <Text style={styles.bismillahAr}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
        <Text style={styles.bismillahMm}>
          သနားကြင်နာ ညှာတာတော်မူသော၊ အနန္တ ဂရုဏာတော်ရှင်ဖြစ်တော်မူသော
          အလ္လာဟ်အရှင်မြတ်၏ နာမတော်ဖြင့် အစပြုပါ၏
        </Text>
      </View>

      {/* Section title */}
      <Text style={styles.sectionTitle}>ရွေးချယ်ပါ</Text>

      {/* Two main buttons */}
      <View style={styles.buttonRow}>
        {/* Quran */}
        <TouchableOpacity
          style={[styles.card, styles.quranCard]}
          onPress={() =>
            navigation.navigate("QuranStack", { screen: "SurahList" })
          }
          activeOpacity={0.85}
        >
          <Image
            source={require("../../assets/quran_cover.png")}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardArabic}>الْقُرْآن</Text>
            <Text style={styles.cardTitle}>ကုရ်အာန်</Text>
            {/* <Text style={styles.cardSub}>114 Surahs</Text> */}
          </View>
        </TouchableOpacity>

        {/* Hadith */}
        <TouchableOpacity
          style={[styles.card, styles.hadithCard]}
          onPress={() =>
            navigation.navigate("HadithStack", { screen: "HadithBooks" })
          }
          activeOpacity={0.85}
        >
          <Image
            source={require("../../assets/hadith_cover.png")}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardArabic}>الْحَدِيث</Text>
            <Text style={styles.cardTitle}>ဟဒီးဆ်</Text>
            {/* <Text style={styles.cardSub}>4 အုပ်</Text> */}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  greeting: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bismillahCard: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    ...SHADOW.card,
  },
  bismillahAr: {
    fontFamily: FONTS.arabic,
    fontSize: 26,
    color: COLORS.gold,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  bismillahMm: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOW.card,
  },
  quranCard: {},
  hadithCard: {},
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: SPACING.sm,
  },
  cardArabic: {
    fontFamily: FONTS.arabic,
    fontSize: 22,
    color: COLORS.gold,
    textAlign: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  cardSub: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginTop: 2,
  },
});
