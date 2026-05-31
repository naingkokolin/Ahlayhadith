import React from "react";
import { Page } from "../types";

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const NAV_GROUPS: {
  label: string;
  items: { id: Page; label: string; icon: React.ReactNode }[];
}[] = [
  {
    label: "Quran",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <rect x="1" y="1" width="6" height="6" rx="1.5" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" />
          </svg>
        ),
      },
      {
        id: "surahs",
        label: "Surahs",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M3 3h10M3 6h10M3 9h6M3 12h8" />
          </svg>
        ),
      },
      {
        id: "ayahs",
        label: "Ayahs",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
            <path d="M5 7h6M5 10h4" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Hadith",
    items: [
      {
        id: "hadith-books",
        label: "Books",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M3 2h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M5 5h6M5 8h6M5 11h4" />
          </svg>
        ),
      },
      {
        id: "hadith-chapters",
        label: "Chapters",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M2 3h12M2 6h8M2 9h10M2 12h6" />
          </svg>
        ),
      },
      {
        id: "hadiths",
        label: "Hadiths",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3l2 2" />
          </svg>
        ),
      },
    ],
  },
];

const Sidebar: React.FC<Props> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoAr}>المصحف</div>
        <span style={styles.logoSub}>Admin Panel</span>
      </div>

      <div style={styles.navScroll}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div style={styles.sectionLabel}>{group.label}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.navItem,
                  ...(currentPage === item.id ? styles.navItemActive : {}),
                }}
                onClick={() => onNavigate(item.id)}
              >
                {currentPage === item.id && <div style={styles.activeBar} />}
                <span style={{ color: "inherit", display: "flex" }}>
                  {item.icon}
                </span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.avatar}>A</div>
        <div style={styles.avatarInfo}>
          <div style={styles.avatarName}>Admin</div>
          <div style={styles.avatarRole}>Super Admin</div>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout} title="Logout">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "var(--sidebar-w)",
    background: "var(--surface)",
    borderRight: "0.5px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  logo: {
    padding: "24px 20px 20px",
    borderBottom: "0.5px solid var(--border)",
  },
  logoAr: {
    fontFamily: "var(--font-display)",
    fontSize: 18,
    color: "var(--gold)",
  },
  logoSub: {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "var(--text3)",
    marginTop: 2,
  },
  navScroll: { flex: 1, overflowY: "auto" },
  sectionLabel: {
    padding: "16px 20px 5px",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "var(--text3)",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    color: "var(--text2)",
    cursor: "pointer",
    transition: "all 0.15s",
    fontSize: 13,
    fontWeight: 400,
    position: "relative",
    userSelect: "none",
  },
  navItemActive: { color: "var(--gold)", background: "var(--gold-dim)" },
  activeBar: {
    position: "absolute",
    left: 0,
    top: 4,
    bottom: 4,
    width: 2,
    background: "var(--gold)",
    borderRadius: "0 2px 2px 0",
  },
  footer: {
    marginTop: "auto",
    padding: "16px 20px",
    borderTop: "0.5px solid var(--border)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--gold-dim)",
    border: "1px solid var(--gold)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: "var(--gold)",
    fontWeight: 600,
    flexShrink: 0,
  },
  avatarInfo: { flex: 1, minWidth: 0 },
  avatarName: { fontSize: 12, fontWeight: 500, color: "var(--text)" },
  avatarRole: {
    fontSize: 10,
    color: "var(--text3)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text3)",
    padding: 4,
    borderRadius: 4,
    flexShrink: 0,
    display: "flex",
    transition: "color 0.15s",
  },
};

export default Sidebar;
