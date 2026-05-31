import React, { useState, useMemo } from "react";
import { IHadithBook, IHadithChapter, IHadith, getRefId } from "../types";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

interface Props {
  books: IHadithBook[];
  chapters: IHadithChapter[];
  hadiths: IHadith[];
  onAdd: (hadith: Omit<IHadith, "_id">) => void;
  onUpdate: (id: string, hadith: Omit<IHadith, "_id">) => void;
  onDelete: (id: string) => void;
}

const PER_PAGE = 6;

const GRADES = ["Sahih", "Hasan", "Da'if", "Mawdu'", "Mursal"];

const GRADE_BADGE: Record<string, string> = {
  "Sahih":   "badge-green",
  "Hasan":   "badge-blue",
  "Da'if":   "badge-gold",
  "Mawdu'":  "badge-danger",
  "Mursal":  "badge-gold",
};

const EMPTY = (bookId: string, chapterId: string): Omit<IHadith, "_id"> => ({
  book: bookId,
  chapter: chapterId,
  hadith_number: 0,
  text_ar: "",
  text_mm: "",
  grade: "Sahih",
});

const HadithsPage: React.FC<Props> = ({ books, chapters, hadiths, onAdd, onUpdate, onDelete }) => {
  const [selectedBookId, setSelectedBookId]       = useState(books[0]?._id ?? "");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [delOpen, setDelOpen]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delTarget, setDelTarget] = useState<IHadith | null>(null);
  const [form, setForm] = useState<Omit<IHadith, "_id">>(EMPTY(selectedBookId, ""));
  const [formError, setFormError] = useState("");

  // Chapters belonging to the selected book
  const bookChapters = useMemo(
    () => chapters.filter((c) => getRefId(c.book) === selectedBookId),
    [chapters, selectedBookId]
  );

  const currentBook    = books.find((b) => b._id === selectedBookId);
  const currentChapter = bookChapters.find((c) => c._id === selectedChapterId);

  const filtered = useMemo(() => {
    let list = hadiths.filter((h) => getRefId(h.book) === selectedBookId);
    if (selectedChapterId) list = list.filter((h) => getRefId(h.chapter) === selectedChapterId);
    const q = search.toLowerCase();
    return q
      ? list.filter(
          (h) =>
            h.text_mm.toLowerCase().includes(q) ||
            h.text_ar.includes(q) ||
            h.grade.toLowerCase().includes(q) ||
            String(h.hadith_number).includes(q)
        )
      : list;
  }, [hadiths, selectedBookId, selectedChapterId, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId("");
    setPage(1); setSearch("");
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY(selectedBookId, selectedChapterId || (bookChapters[0]?._id ?? "")));
    setFormError(""); setModalOpen(true);
  };

  const openEdit = (h: IHadith) => {
    setEditingId(h._id ?? null);
    setForm({
      book: getRefId(h.book),
      chapter: getRefId(h.chapter),
      hadith_number: h.hadith_number,
      text_ar: h.text_ar,
      text_mm: h.text_mm,
      grade: h.grade,
    });
    setFormError(""); setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.book || !form.chapter || !form.hadith_number || !form.text_ar || !form.text_mm) {
      setFormError("All fields are required."); return;
    }
    editingId ? onUpdate(editingId, form) : onAdd(form);
    setModalOpen(false);
  };

  // Chapters for the form's selected book
  const formBookChapters = useMemo(
    () => chapters.filter((c) => getRefId(c.book) === (form.book as string)),
    [chapters, form.book]
  );

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={styles.topbar}>
        <div>
          <div style={styles.title}>Hadiths</div>
          <div style={styles.sub}>Manage hadith records by book and chapter</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Hadith</button>
      </div>

      <div style={styles.content}>
        {/* Selectors */}
        <div style={styles.selectorBar}>
          <span style={styles.selectorLabel}>Book:</span>
          <select className="select-input" value={selectedBookId} onChange={(e) => handleBookChange(e.target.value)}>
            {books.map((b) => <option key={b._id} value={b._id}>{b.book_number}. {b.name_en}</option>)}
          </select>
          <span style={styles.selectorLabel}>Chapter:</span>
          <select className="select-input" value={selectedChapterId}
            onChange={(e) => { setSelectedChapterId(e.target.value); setPage(1); }}>
            <option value="">All Chapters</option>
            {bookChapters.map((c) => <option key={c._id} value={c._id}>{c.chapter_number}. {c.name_en}</option>)}
          </select>
          <input className="search-input" placeholder="Search hadith..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              {currentBook?.name_en}
              {currentChapter ? ` › ${currentChapter.name_en}` : ""}
            </div>
            <span className="badge badge-gold">{filtered.length} hadiths</span>
          </div>
          <table>
            <thead>
              <tr><th>#</th><th>Arabic Text</th><th>Myanmar Translation</th><th>Grade</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={5} style={styles.empty}>No hadiths found</td></tr>
              ) : slice.map((h) => (
                <tr key={h._id}>
                  <td><span className="badge badge-gold">{h.hadith_number}</span></td>
                  <td className="td-ar" style={{ maxWidth: 200 }}>{h.text_ar}</td>
                  <td className="td-mm" style={{ maxWidth: 280 }}>{h.text_mm}</td>
                  <td>
                    <span className={`badge ${GRADE_BADGE[h.grade] ?? "badge-gold"}`}>{h.grade}</span>
                  </td>
                  <td>
                    <div className="action-cell">
                      <button className="btn btn-sm" onClick={() => openEdit(h)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => { setDelTarget(h); setDelOpen(true); }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={safePage} totalPages={totalPages} totalItems={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Hadith" : "Add Hadith"}
        subtitle="Enter the hadith details below."
        footer={<><button className="btn" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save Hadith</button></>}
      >
        <div style={styles.formGrid}>
          <div className="field-wrap">
            <label className="field-label">Book</label>
            <select className="field-input select-input" value={form.book as string}
              onChange={(e) => { set("book", e.target.value); set("chapter", ""); }}>
              {books.map((b) => <option key={b._id} value={b._id}>{b.book_number}. {b.name_en}</option>)}
            </select>
          </div>
          <div className="field-wrap">
            <label className="field-label">Chapter</label>
            <select className="field-input select-input" value={form.chapter as string}
              onChange={(e) => set("chapter", e.target.value)}>
              <option value="">— Select chapter —</option>
              {formBookChapters.map((c) => <option key={c._id} value={c._id}>{c.chapter_number}. {c.name_en}</option>)}
            </select>
          </div>
          <div className="field-wrap">
            <label className="field-label">Hadith Number</label>
            <input className="field-input" type="number" min={1} value={form.hadith_number || ""}
              onChange={(e) => set("hadith_number", parseInt(e.target.value))} placeholder="e.g. 1" />
          </div>
          <div className="field-wrap">
            <label className="field-label">Grade</label>
            <select className="field-input select-input" value={form.grade}
              onChange={(e) => set("grade", e.target.value)}>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Arabic Text</label>
            <textarea className="field-input" value={form.text_ar}
              onChange={(e) => set("text_ar", e.target.value)}
              placeholder="Enter Arabic hadith text..."
              style={{ direction: "rtl", fontSize: 16, lineHeight: 2, minHeight: 90 }} />
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Myanmar Translation</label>
            <textarea className="field-input" value={form.text_mm}
              onChange={(e) => set("text_mm", e.target.value)}
              placeholder="Myanmar translation..."
              style={{ minHeight: 90 }} />
          </div>
        </div>
        {formError && <div style={styles.formError}>{formError}</div>}
      </Modal>

      {/* Delete Modal */}
      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="Delete Hadith" danger width={360}
        footer={<><button className="btn" onClick={() => setDelOpen(false)}>Cancel</button><button className="btn btn-danger" onClick={() => { if (delTarget?._id) onDelete(delTarget._id); setDelOpen(false); }}>Delete</button></>}
      >
        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Delete Hadith <strong style={{ color: "var(--text)" }}>#{delTarget?.hadith_number}</strong>? This cannot be undone.
          </div>
        </div>
      </Modal>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topbar: { padding: "16px 28px", borderBottom: "0.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", position: "sticky", top: 0, zIndex: 50 },
  title: { fontFamily: "var(--font-display)", fontSize: 20 },
  sub: { fontSize: 11, color: "var(--text3)", marginTop: 1, letterSpacing: 1 },
  content: { padding: 28 },
  selectorBar: { display: "flex", gap: 10, alignItems: "center", marginBottom: 20, flexWrap: "wrap" },
  selectorLabel: { fontSize: 12, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" },
  formError: { color: "var(--danger)", fontSize: 12, marginTop: 8 },
  empty: { textAlign: "center", color: "var(--text3)", padding: 32 },
};

export default HadithsPage;
