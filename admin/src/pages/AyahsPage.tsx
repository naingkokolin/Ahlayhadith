import React, { useState, useMemo } from "react";
import { ISurah, IAyah, getSurahId } from "../types";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

interface Props {
  surahs: ISurah[];
  ayahs: IAyah[];
  onAdd: (ayah: Omit<IAyah, "_id">) => void;
  onUpdate: (id: string, ayah: Omit<IAyah, "_id">) => void;
  onDelete: (id: string) => void;
}

const PER_PAGE = 8;

const EMPTY_FORM = (surahId: string): Omit<IAyah, "_id"> => ({
  surah: surahId,
  ayah_number: 0,
  text_ar: "",
  text_mm: "",
});

const AyahsPage: React.FC<Props> = ({
  surahs,
  ayahs,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [selectedSurahId, setSelectedSurahId] = useState(surahs[0]?._id ?? "");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delTarget, setDelTarget] = useState<IAyah | null>(null);
  const [form, setForm] = useState<Omit<IAyah, "_id">>(
    EMPTY_FORM(selectedSurahId),
  );
  const [formError, setFormError] = useState("");

  const currentSurah = surahs.find((s) => s._id === selectedSurahId);

  const filtered = useMemo(() => {
    const surahAyahs = ayahs.filter(
      (a) => getSurahId(a.surah) === selectedSurahId,
    );
    const q = search.toLowerCase();
    return q
      ? surahAyahs.filter(
          (a) =>
            a.text_mm.toLowerCase().includes(q) ||
            a.text_ar.includes(q) ||
            String(a.ayah_number).includes(q),
        )
      : surahAyahs;
  }, [ayahs, selectedSurahId, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM(selectedSurahId));
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (a: IAyah) => {
    setEditingId(a._id ?? null);
    setForm({
      surah: getSurahId(a.surah),
      ayah_number: a.ayah_number,
      text_ar: a.text_ar,
      text_mm: a.text_mm,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.surah || !form.ayah_number || !form.text_ar || !form.text_mm) {
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

  const confirmDelete = (a: IAyah) => {
    setDelTarget(a);
    setDelModalOpen(true);
  };

  const handleDelete = () => {
    if (delTarget?._id) onDelete(delTarget._id);
    setDelModalOpen(false);
    setDelTarget(null);
  };

  const setF = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      {/* Topbar */}
      <div style={styles.topbar}>
        <div>
          <div style={styles.topbarTitle}>Ayahs</div>
          <div style={styles.topbarSub}>Manage verses by surah</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Ayah
        </button>
      </div>

      <div style={styles.content}>
        {/* Selector bar */}
        <div style={styles.selectorBar}>
          <span style={styles.selectorLabel}>Surah:</span>
          <select
            className="select-input"
            value={selectedSurahId}
            onChange={(e) => {
              setSelectedSurahId(e.target.value);
              setPage(1);
              setSearch("");
            }}
          >
            {surahs.map((s) => (
              <option key={s._id} value={s._id}>
                {s.surah_number}. {s.name_en}
              </option>
            ))}
          </select>
          <input
            className="search-input"
            placeholder="Search ayah..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              {currentSurah
                ? `${currentSurah.name_en} — ${currentSurah.name_ar}`
                : "Ayahs"}
            </div>
            <span className="badge badge-gold">{filtered.length} verses</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Arabic Text</th>
                <th>Myanmar Translation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={4} style={styles.empty}>
                    No ayahs found
                  </td>
                </tr>
              ) : (
                slice.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <span className="badge badge-gold">{a.ayah_number}</span>
                    </td>
                    <td className="td-ar" style={{ maxWidth: 220 }}>
                      {a.text_ar}
                    </td>
                    <td className="td-mm">{a.text_mm}</td>
                    <td>
                      <div className="action-cell">
                        <button
                          className="btn btn-sm"
                          onClick={() => openEdit(a)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmDelete(a)}
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
        title={editingId ? "Edit Ayah" : "Add Ayah"}
        subtitle="Enter the verse details below."
        footer={
          <>
            <button className="btn" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Ayah
            </button>
          </>
        }
      >
        <div style={styles.formGrid}>
          <div className="field-wrap">
            <label className="field-label">Surah</label>
            <select
              className="field-input select-input"
              value={form.surah as string}
              onChange={(e) => setF("surah", e.target.value)}
            >
              {surahs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.surah_number}. {s.name_en}
                </option>
              ))}
            </select>
          </div>
          <div className="field-wrap">
            <label className="field-label">Ayah Number</label>
            <input
              className="field-input"
              type="number"
              min={1}
              value={form.ayah_number || ""}
              onChange={(e) => setF("ayah_number", parseInt(e.target.value))}
              placeholder="e.g. 1"
            />
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Arabic Text</label>
            <textarea
              className="field-input"
              value={form.text_ar}
              onChange={(e) => setF("text_ar", e.target.value)}
              placeholder="Enter Arabic verse..."
              style={{ direction: "rtl", fontSize: 17, lineHeight: 2 }}
            />
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Myanmar Translation</label>
            <textarea
              className="field-input"
              value={form.text_mm}
              onChange={(e) => setF("text_mm", e.target.value)}
              placeholder="Myanmar translation..."
            />
          </div>
        </div>
        {formError && <div style={styles.formError}>{formError}</div>}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={delModalOpen}
        onClose={() => setDelModalOpen(false)}
        title="Delete Ayah"
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
            Delete Ayah{" "}
            <strong style={{ color: "var(--text)" }}>
              {delTarget?.ayah_number}
            </strong>
            ? This action cannot be undone.
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
  selectorBar: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 12,
    color: "var(--text3)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" },
  formError: { color: "var(--danger)", fontSize: 12, marginTop: 8 },
  empty: { textAlign: "center", color: "var(--text3)", padding: 32 },
};

export default AyahsPage;
