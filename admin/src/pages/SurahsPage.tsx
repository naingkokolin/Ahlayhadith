import React, { useState, useMemo } from "react";
import { ISurah } from "../types";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

interface Props {
  surahs: ISurah[];
  onAdd: (surah: Omit<ISurah, "_id">) => void;
  onUpdate: (id: string, surah: Omit<ISurah, "_id">) => void;
  onDelete: (id: string) => void;
}

const PER_PAGE = 8;

const EMPTY_FORM = (): Omit<ISurah, "_id"> => ({
  surah_number: 0,
  name_ar: "",
  name_en: "",
  name_mm: "",
  totalAyah: 0,
});

const SurahsPage: React.FC<Props> = ({ surahs, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delTarget, setDelTarget] = useState<ISurah | null>(null);
  const [form, setForm] = useState<Omit<ISurah, "_id">>(EMPTY_FORM());
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? surahs.filter(
          (s) =>
            s.name_en.toLowerCase().includes(q) ||
            s.name_ar.includes(q) ||
            s.name_mm.includes(q) ||
            String(s.surah_number).includes(q),
        )
      : surahs;
  }, [surahs, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM());
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (s: ISurah) => {
    setEditingId(s._id ?? null);
    setForm({
      surah_number: s.surah_number,
      name_ar: s.name_ar,
      name_en: s.name_en,
      name_mm: s.name_mm,
      totalAyah: s.totalAyah,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    if (
      !form.surah_number ||
      !form.name_ar ||
      !form.name_en ||
      !form.name_mm ||
      !form.totalAyah
    ) {
      setFormError("All fields are required.");
      return;
    }
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form);
    }
    setModalOpen(false);
  };

  const confirmDelete = (s: ISurah) => {
    setDelTarget(s);
    setDelModalOpen(true);
  };

  const handleDelete = () => {
    if (delTarget?._id) onDelete(delTarget._id);
    setDelModalOpen(false);
    setDelTarget(null);
  };

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      {/* Topbar */}
      <div style={styles.topbar}>
        <div>
          <div style={styles.topbarTitle}>Surahs</div>
          <div style={styles.topbarSub}>
            Manage all {surahs.length} chapters
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Surah
        </button>
      </div>

      <div style={styles.content}>
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">All Surahs</div>
            <input
              className="search-input"
              placeholder="Search surah..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Arabic</th>
                <th>English</th>
                <th>Myanmar</th>
                <th>Ayahs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.empty}>
                    No surahs found
                  </td>
                </tr>
              ) : (
                slice.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <span className="badge badge-gold">{s.surah_number}</span>
                    </td>
                    <td className="td-ar">{s.name_ar}</td>
                    <td className="td-main">{s.name_en}</td>
                    <td>{s.name_mm}</td>
                    <td>
                      <span className="badge badge-blue">{s.totalAyah}</span>
                    </td>
                    <td>
                      <div className="action-cell">
                        <button
                          className="btn btn-sm"
                          onClick={() => openEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmDelete(s)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Surah" : "Add Surah"}
        subtitle={
          editingId
            ? "Update the surah record."
            : "Fill in all fields to create a new surah record."
        }
        footer={
          <>
            <button className="btn" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Surah
            </button>
          </>
        }
      >
        <div style={styles.formGrid}>
          <div className="field-wrap">
            <label className="field-label">Surah Number</label>
            <input
              className="field-input"
              type="number"
              min={1}
              max={114}
              value={form.surah_number || ""}
              onChange={(e) => set("surah_number", parseInt(e.target.value))}
              placeholder="1–114"
            />
          </div>
          <div className="field-wrap">
            <label className="field-label">Total Ayahs</label>
            <input
              className="field-input"
              type="number"
              min={1}
              value={form.totalAyah || ""}
              onChange={(e) => set("totalAyah", parseInt(e.target.value))}
              placeholder="e.g. 7"
            />
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Arabic Name</label>
            <input
              className="field-input"
              type="text"
              value={form.name_ar}
              onChange={(e) => set("name_ar", e.target.value)}
              placeholder="e.g. الفاتحة"
              style={{ direction: "rtl", fontSize: 18 }}
            />
          </div>
          <div className="field-wrap">
            <label className="field-label">English Name</label>
            <input
              className="field-input"
              type="text"
              value={form.name_en}
              onChange={(e) => set("name_en", e.target.value)}
              placeholder="e.g. Al-Fatihah"
            />
          </div>
          <div className="field-wrap">
            <label className="field-label">Myanmar Name</label>
            <input
              className="field-input"
              type="text"
              value={form.name_mm}
              onChange={(e) => set("name_mm", e.target.value)}
              placeholder="e.g. အာလ်ဖာသီဟာ"
            />
          </div>
        </div>
        {formError && <div style={styles.formError}>{formError}</div>}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={delModalOpen}
        onClose={() => setDelModalOpen(false)}
        title="Delete Surah"
        danger
        width={360}
        footer={
          <>
            <button className="btn" onClick={() => setDelModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      >
        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Delete{" "}
            <strong style={{ color: "var(--text)" }}>
              {delTarget?.name_en}
            </strong>{" "}
            (Surah {delTarget?.surah_number})? This action cannot be undone.
          </div>
        </div>
      </Modal>
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
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" },
  formError: { color: "var(--danger)", fontSize: 12, marginTop: 8 },
  empty: { textAlign: "center", color: "var(--text3)", padding: 32 },
};

export default SurahsPage;
