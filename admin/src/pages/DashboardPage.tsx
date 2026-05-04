import React from "react";
import { ISurah, IAyah } from "../types";

interface Props {
  surahs: ISurah[];
  ayahs: IAyah[];
}

const DashboardPage: React.FC<Props> = ({ surahs, ayahs }) => {
  const totalAyahs = ayahs.length;
  const topSurahs = surahs.slice(0, 5);
  const longest = [...surahs]
    .sort((a, b) => b.totalAyah - a.totalAyah)
    .slice(0, 5);

  return (
    <div>
      <div style={styles.topbar}>
        <div>
          <div style={styles.topbarTitle}>Dashboard</div>
          <div style={styles.topbarSub}>Overview of your Quran data</div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            {
              label: "Total Surahs",
              value: surahs.length,
              sub: "All chapters",
              accent: true,
            },
            { label: "Total Ayahs", value: totalAyahs, sub: "Loaded records" },
            { label: "Languages", value: 3, sub: "Arabic, Myanmar, English" },
            {
              label: "Last Updated",
              value: "Today",
              sub: "All records synced",
              small: true,
            },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-label">{s.label}</div>
              <div
                className={`stat-value${s.accent ? " stat-accent" : ""}`}
                style={s.small ? { fontSize: 18, marginTop: 4 } : {}}
              >
                {s.value}
              </div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Lists */}
        <div style={styles.twoCol}>
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">Recent Surahs</div>
              <span className="badge badge-gold">{surahs.length} total</span>
            </div>
            <div>
              {topSurahs.map((s) => (
                <div style={styles.listItem} key={s._id}>
                  <div style={styles.listNum}>{s.surah_number}</div>
                  <div style={styles.listInfo}>
                    <div style={styles.listName}>{s.name_en}</div>
                    <div style={styles.listMeta}>{s.name_mm}</div>
                  </div>
                  <div style={styles.listRight}>{s.totalAyah} ayahs</div>
                </div>
              ))}
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <div className="table-title">Longest Surahs</div>
              <span className="badge badge-blue">by ayah count</span>
            </div>
            <div>
              {longest.map((s) => (
                <div style={styles.listItem} key={s._id}>
                  <div style={styles.listNum}>{s.surah_number}</div>
                  <div style={styles.listInfo}>
                    <div style={styles.listName}>{s.name_en}</div>
                    <div style={styles.listMeta}>{s.name_ar}</div>
                  </div>
                  <span className="badge badge-green">{s.totalAyah}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    padding: "16px 28px",
    borderBottom: "0.5px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--surface)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  topbarTitle: { fontFamily: "var(--font-display)", fontSize: 20 },
  topbarSub: {
    fontSize: 11,
    color: "var(--text3)",
    marginTop: 1,
    letterSpacing: 1,
  },
  content: { padding: 28 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 28,
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 18px",
    borderBottom: "0.5px solid var(--border)",
  },
  listNum: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "var(--gold-dim)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    color: "var(--gold)",
    fontWeight: 600,
    flexShrink: 0,
  },
  listInfo: { flex: 1 },
  listName: { fontSize: 13, color: "var(--text)" },
  listMeta: { fontSize: 11, color: "var(--text3)" },
  listRight: { fontSize: 12, color: "var(--text3)" },
};

export default DashboardPage;
