import React, { useState, useEffect } from "react";
import { ISurah, IAyah, Page, getSurahId } from "./types";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SurahsPage from "./pages/SurahsPage";
import AyahsPage from "./pages/AyahsPage";
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
  const [surahs, setSurahs] = useState<ISurah[]>([]);
  const [ayahs, setAyahs] = useState<IAyah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch everything on login ──────────────────────────────
  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [surahRes, ayahRes] = await Promise.all([
          getSurahs(),
          getAyahs(),
        ]);
        if (cancelled) return;
        setSurahs(
          [...surahRes.data.surahs].sort(
            (a, b) => a.surah_number - b.surah_number,
          ),
        );
        setAyahs(
          [...ayahRes.data.ayahs].sort((a, b) => a.ayah_number - b.ayah_number),
        );
      } catch {
        if (!cancelled)
          setError(
            "Cannot reach the server at http://localhost:8000/api — is your backend running?",
          );
      } finally {
        if (!cancelled) setLoading(false);
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

  // ── Logout ─────────────────────────────────────────────────
  const handleLogout = () => {
    setLoggedIn(false);
    setSurahs([]);
    setAyahs([]);
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
      </main>
    </div>
  );
};

export default App;
