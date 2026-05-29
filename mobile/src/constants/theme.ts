// ─── Colors ───────────────────────────────────────────────────────────────────
export const COLORS = {
  primary: "#1B6B4A",       // Deep green — Quran
  primaryLight: "#E8F5EE",
  secondary: "#8B4513",     // Deep brown — Hadith
  secondaryLight: "#F5EDE8",
  background: "#F9F6F0",    // Warm parchment
  card: "#FFFFFF",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  arabic: "#1B6B4A",
  border: "#E5E7EB",
  gold: "#C8A951",
  white: "#FFFFFF",
  error: "#DC2626",
};

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Uses Expo Google Fonts — install with:
// npx expo install @expo-google-fonts/scheherazade-new @expo-google-fonts/noto-sans-myanmar expo-font
export const FONTS = {
  regular: "NotoSansMyanmar_400Regular",
  bold: "NotoSansMyanmar_700Bold",
  arabic: "ScheherazadeNew_400Regular",
  arabicBold: "ScheherazadeNew_700Bold",
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// ─── Shadow ───────────────────────────────────────────────────────────────────
export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
