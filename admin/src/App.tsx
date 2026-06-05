import React, { useState, useEffect } from "react";
import {
  ISurah,
  IAyah,
  IHadithBook,
  IHadithChapter,
  IHadith,
  Page,
  getSurahId,
  getRefId,
  IHadithBible,
} from "./types";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SurahsPage from "./pages/SurahsPage";
import AyahsPage from "./pages/AyahsPage";
import HadithBiblesPage from "./pages/HadithBiblesPage";
import HadithBooksPage from "./pages/HadithBooksPage";
import HadithChaptersPage from "./pages/HadithChaptersPage";
import HadithsPage from "./pages/HadithsPage";
import Sidebar from "./components/Sidebar";
import {
  getSurahs,
  createSurah,
  updateSurah as apiUpdateSurah,
  deleteSurah as apiDeleteSurah,
  getAyahs,
  createAyah,
  updateAyah as apiUpdateAyah,
  deleteAyah as apiDeleteAyah,
  getHadithBibles,
  createHadithBible,
  updateHadithBible as apiUpdateBible,
  deleteHadithBible as apiDeleteBible,
  getHadithBooks,
  createHadithBook,
  updateHadithBook as apiUpdateBook,
  deleteHadithBook as apiDeleteBook,
  getHadithChapters,
  createHadithChapter,
  updateHadithChapter as apiUpdateChapter,
  deleteHadithChapter as apiDeleteChapter,
  getHadiths,
  createHadith,
  updateHadith as apiUpdateHadith,
  deleteHadith as apiDeleteHadith,
} from "./services/api";
import "./styles/globals.css";

// ─── Inject spinner keyframe once ─────────────────────────────
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

// ─── Loading Spinner ───────────────────────────────────────────
const Spinner: React.FC = () => (
  <div style={spinnerStyles.overlay}>
    <div style={spinnerStyles.ring} />
    <div style={spinnerStyles.text}>Loading data…</div>
  </div>
);
const spinnerStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    zIndex: 9999,
  },
  ring: {
    width: 40,
    height: 40,
    border: "2.5px solid var(--border2)",
    borderTop: "2.5px solid var(--gold)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: { fontSize: 13, color: "var(--text3)", letterSpacing: 1 },
};

// ─── Error Banner ──────────────────────────────────────────────
const ErrorBanner: React.FC<{ message: string; onDismiss: () => void }> = ({
  message,
  onDismiss,
}) => (
  <div style={errorStyles.banner}>
    <span>⚠ {message}</span>
    <button style={errorStyles.close} onClick={onDismiss}>
      ✕
    </button>
  </div>
);
const errorStyles: Record<string, React.CSSProperties> = {
  banner: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 9000,
    background: "var(--danger-dim)",
    border: "0.5px solid rgba(224,92,92,0.4)",
    color: "var(--danger)",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 14,
    maxWidth: 400,
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  close: {
    background: "none",
    border: "none",
    color: "var(--danger)",
    cursor: "pointer",
    fontSize: 14,
    flexShrink: 0,
  },
};

// ══════════════════════════════════════════════════════════════
const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Quran state ────────────────────────────────────────────
  const [surahs, setSurahs] = useState<ISurah[]>([]);
  const [ayahs, setAyahs] = useState<IAyah[]>([]);

  // ── Hadith state ───────────────────────────────────────────
  const [hadithBibles, setHadithBibles] = useState<IHadithBible[]>([]);
  const [hadithBooks, setHadithBooks] = useState<IHadithBook[]>([]);
  const [hadithChapters, setHadithChapters] = useState<IHadithChapter[]>([]);
  const [hadiths, setHadiths] = useState<IHadith[]>([]);

  // ── Fetch everything on login ──────────────────────────────
  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      const errors: string[] = [];

      // Quran — critical, show error if these fail
      try {
        const [surahRes, ayahRes] = await Promise.all([
          getSurahs(),
          getAyahs(),
        ]);
        if (!cancelled) {
          setSurahs(
            [...surahRes.data.surahs].sort(
              (a, b) => a.surah_number - b.surah_number,
            ),
          );
          setAyahs(
            [...ayahRes.data.ayahs].sort(
              (a, b) => a.ayah_number - b.ayah_number,
            ),
          );
        }
      } catch {
        errors.push("Quran data (surahs/ayahs)");
      }

      // Hadith — independent, Quran still shows if these fail
      try {
        const [bibleRes, bookRes, chapterRes, hadithRes] = await Promise.all([
          getHadithBibles(),
          getHadithBooks(),
          getHadithChapters(),
          getHadiths(),
        ]);
        if (!cancelled) {
          setHadithBibles(
            [...bibleRes.data.bibles].sort(
              (a, b) => a.bible_number - b.bible_number,
            ),
          );
          setHadithBooks(
            [...bookRes.data.books].sort(
              (a, b) => a.book_number - b.book_number,
            ),
          );
          setHadithChapters(
            [...chapterRes.data.chapters].sort(
              (a, b) => a.chapter_number - b.chapter_number,
            ),
          );
          setHadiths(
            [...hadithRes.data.hadiths].sort(
              (a, b) => a.hadith_number - b.hadith_number,
            ),
          );
        }
      } catch {
        errors.push("Hadith data (books/chapters/hadiths)");
      }

      if (!cancelled) {
        if (errors.length > 0)
          setError(
            `Failed to load: ${errors.join(" and ")}. Check your backend routes.`,
          );
        setLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  // ── Surah CRUD ─────────────────────────────────────────────
  const addSurah = async (data: Omit<ISurah, "_id">) => {
    try {
      const res = await createSurah(data as ISurah);
      setSurahs((prev) =>
        [...prev, res.data.surah].sort(
          (a, b) => a.surah_number - b.surah_number,
        ),
      );
    } catch {
      setError("Failed to create surah.");
    }
  };
  const updateSurah = async (id: string, data: Omit<ISurah, "_id">) => {
    try {
      const res = await apiUpdateSurah(id, data);
      setSurahs((prev) =>
        prev
          .map((s) => (s._id === id ? res.data.surah : s))
          .sort((a, b) => a.surah_number - b.surah_number),
      );
    } catch {
      setError("Failed to update surah.");
    }
  };
  const deleteSurah = async (id: string) => {
    try {
      await apiDeleteSurah(id);
      setSurahs((prev) => prev.filter((s) => s._id !== id));
      setAyahs((prev) => prev.filter((a) => getSurahId(a.surah) !== id));
    } catch {
      setError("Failed to delete surah.");
    }
  };

  // ── Ayah CRUD ──────────────────────────────────────────────
  const addAyah = async (data: Omit<IAyah, "_id">) => {
    try {
      const res = await createAyah(data as IAyah);
      setAyahs((prev) =>
        [...prev, res.data.ayah].sort((a, b) => a.ayah_number - b.ayah_number),
      );
    } catch {
      setError("Failed to create ayah.");
    }
  };
  const updateAyah = async (id: string, data: Omit<IAyah, "_id">) => {
    try {
      const res = await apiUpdateAyah(id, data);
      setAyahs((prev) => prev.map((a) => (a._id === id ? res.data.ayah : a)));
    } catch {
      setError("Failed to update ayah.");
    }
  };
  const deleteAyah = async (id: string) => {
    try {
      await apiDeleteAyah(id);
      setAyahs((prev) => prev.filter((a) => a._id !== id));
    } catch {
      setError("Failed to delete ayah.");
    }
  };

  // ── HadithBible CRUD ────────────────────────────────────────
  const addHadithBible = async (data: Omit<IHadithBible, "_id">) => {
    try {
      const res = await createHadithBible(data as IHadithBible);
      setHadithBibles((prev) =>
        [...prev, res.data.bible].sort(
          (a, b) => a.bible_number - b.bible_number,
        ),
      );
    } catch {
      setError("Failed to create hadith bible.");
    }
  };

  const updateHadithBible = async (
    id: string,
    data: Omit<IHadithBible, "_id">,
  ) => {
    try {
      const res = await apiUpdateBible(id, data);
      setHadithBibles((prev) =>
        prev
          .map((b) => (b._id === id ? res.data.bible : b))
          .sort((a, b) => a.bible_number - b.bible_number),
      );
    } catch {
      setError("Failed to update hadith bible.");
    }
  };
  const deleteHadithBible = async (id: string) => {
    try {
      await apiDeleteBible(id);
      setHadithBibles((prev) => prev.filter((b) => b._id !== id));
      setHadithBooks((prev) => prev.filter((b) => b._id !== id));
      setHadithChapters((prev) => prev.filter((c) => getRefId(c.book) !== id));
      setHadiths((prev) => prev.filter((h) => getRefId(h.book) !== id));
    } catch {
      setError("Failed to delete hadith bible.");
    }
  };

  // ── HadithBook CRUD ────────────────────────────────────────
  const addHadithBook = async (data: Omit<IHadithBook, "_id">) => {
    try {
      const res = await createHadithBook(data as IHadithBook);
      setHadithBooks((prev) =>
        [...prev, res.data.book].sort((a, b) => a.book_number - b.book_number),
      );
    } catch {
      setError("Failed to create hadith book.");
    }
  };
  const updateHadithBook = async (
    id: string,
    data: Omit<IHadithBook, "_id">,
  ) => {
    try {
      const res = await apiUpdateBook(id, data);
      setHadithBooks((prev) =>
        prev
          .map((b) => (b._id === id ? res.data.book : b))
          .sort((a, b) => a.book_number - b.book_number),
      );
    } catch {
      setError("Failed to update hadith book.");
    }
  };
  const deleteHadithBook = async (id: string) => {
    try {
      await apiDeleteBook(id);
      setHadithBooks((prev) => prev.filter((b) => b._id !== id));
      setHadithChapters((prev) => prev.filter((c) => getRefId(c.book) !== id));
      setHadiths((prev) => prev.filter((h) => getRefId(h.book) !== id));
    } catch {
      setError("Failed to delete hadith book.");
    }
  };

  // ── HadithChapter CRUD ─────────────────────────────────────
  const addHadithChapter = async (data: Omit<IHadithChapter, "_id">) => {
    try {
      const res = await createHadithChapter(data as IHadithChapter);
      setHadithChapters((prev) =>
        [...prev, res.data.chapter].sort(
          (a, b) => a.chapter_number - b.chapter_number,
        ),
      );
    } catch {
      setError("Failed to create hadith chapter.");
    }
  };
  const updateHadithChapter = async (
    id: string,
    data: Omit<IHadithChapter, "_id">,
  ) => {
    try {
      const res = await apiUpdateChapter(id, data);
      setHadithChapters((prev) =>
        prev.map((c) => (c._id === id ? res.data.chapter : c)),
      );
    } catch {
      setError("Failed to update hadith chapter.");
    }
  };
  const deleteHadithChapter = async (id: string) => {
    try {
      await apiDeleteChapter(id);
      setHadithChapters((prev) => prev.filter((c) => c._id !== id));
      setHadiths((prev) => prev.filter((h) => getRefId(h.chapter) !== id));
    } catch {
      setError("Failed to delete hadith chapter.");
    }
  };

  // ── Hadith CRUD ────────────────────────────────────────────
  const addHadith = async (data: Omit<IHadith, "_id">) => {
    try {
      const res = await createHadith(data as IHadith);
      setHadiths((prev) =>
        [...prev, res.data.hadith].sort(
          (a, b) => a.hadith_number - b.hadith_number,
        ),
      );
    } catch {
      setError("Failed to create hadith.");
    }
  };
  const updateHadith = async (id: string, data: Omit<IHadith, "_id">) => {
    try {
      const res = await apiUpdateHadith(id, data);
      setHadiths((prev) =>
        prev.map((h) => (h._id === id ? res.data.hadith : h)),
      );
    } catch {
      setError("Failed to update hadith.");
    }
  };
  const deleteHadith = async (id: string) => {
    try {
      await apiDeleteHadith(id);
      setHadiths((prev) => prev.filter((h) => h._id !== id));
    } catch {
      setError("Failed to delete hadith.");
    }
  };

  // ── Logout ─────────────────────────────────────────────────
  const handleLogout = () => {
    setLoggedIn(false);
    setSurahs([]);
    setAyahs([]);
    setHadithBibles([]);
    setHadithBooks([]);
    setHadithChapters([]);
    setHadiths([]);
    setCurrentPage("dashboard");
  };

  // ── Render ─────────────────────────────────────────────────
  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;
  if (loading) return <Spinner />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <main
        style={{ marginLeft: "var(--sidebar-w)", flex: 1, minHeight: "100vh" }}
      >
        {currentPage === "dashboard" && (
          <DashboardPage surahs={surahs} ayahs={ayahs} />
        )}

        {currentPage === "surahs" && (
          <SurahsPage
            surahs={surahs}
            onAdd={addSurah}
            onUpdate={updateSurah}
            onDelete={deleteSurah}
          />
        )}

        {currentPage === "ayahs" && (
          <AyahsPage
            surahs={surahs}
            ayahs={ayahs}
            onAdd={addAyah}
            onUpdate={updateAyah}
            onDelete={deleteAyah}
          />
        )}

        {currentPage === "hadith-bibles" && (
          <HadithBiblesPage
            bibles={hadithBibles}
            // books={hadithBibles}
            onAdd={addHadithBible}
            onUpdate={updateHadithBible}
            onDelete={deleteHadithBible}
          />
        )}

        {currentPage === "hadith-books" && (
          <HadithBooksPage
            // bibles={hadithBibles}
            books={hadithBooks}
            onAdd={addHadithBook}
            onUpdate={updateHadithBook}
            onDelete={deleteHadithBook}
          />
        )}

        {currentPage === "hadith-chapters" && (
          <HadithChaptersPage
            books={hadithBooks}
            chapters={hadithChapters}
            onAdd={addHadithChapter}
            onUpdate={updateHadithChapter}
            onDelete={deleteHadithChapter}
          />
        )}

        {currentPage === "hadiths" && (
          <HadithsPage
            books={hadithBooks}
            chapters={hadithChapters}
            hadiths={hadiths}
            onAdd={addHadith}
            onUpdate={updateHadith}
            onDelete={deleteHadith}
          />
        )}
      </main>
    </div>
  );
};

export default App;
