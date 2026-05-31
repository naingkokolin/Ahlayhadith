import React, { useState, useMemo } from "react";
import { IHadithBook, IHadithChapter, getRefId } from "../types";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

interface Props {
  books: IHadithBook[];
  chapters: IHadithChapter[];
  onAdd: (chapter: Omit<IHadithChapter, "_id">) => void;
  onUpdate: (id: string, chapter: Omit<IHadithChapter, "_id">) => void;
  onDelete: (id: string) => void;
}

const PER_PAGE = 8;

const EMPTY = (bookId: string): Omit<IHadithChapter, "_id"> => ({
  book: bookId,
  chapter_number: 0,
  name_ar: "",
  name_mm: "",
  name_en: "",
  totalHadith: 0,
});

const HadithChaptersPage: React.FC<Props> = ({ books, chapters, onAdd, onUpdate, onDelete }) => {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?._id ?? "");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [delOpen, setDelOpen]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delTarget, setDelTarget] = useState<IHadithChapter | null>(null);
  const [form, setForm]         = useState<Omit<IHadithChapter, "_id">>(EMPTY(selectedBookId));
  const [formError, setFormError] = useState("");

  const currentBook = books.find((b) => b._id === selectedBookId);

  const filtered = useMemo(() => {
    const bookChapters = chapters.filter((c) => getRefId(c.book) === selectedBookId);
    const q = search.toLowerCase();
    return q
      ? bookChapters.filter(
          (c) =>
            c.name_en.toLowerCase().includes(q) ||
            c.name_ar.includes(q) ||
            c.name_mm.includes(q) ||
            String(c.chapter_number).includes(q)
        )
      : bookChapters;
  }, [chapters, selectedBookId, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const openAdd = () => {
    setEditingId(null); setForm(EMPTY(selectedBookId)); setFormError(""); setModalOpen(true);
  };
  const openEdit = (c: IHadithChapter) => {
    setEditingId(c._id ?? null);
    setForm({ book: getRefId(c.book), chapter_number: c.chapter_number, name_ar: c.name_ar, name_mm: c.name_mm, name_en: c.name_en, totalHadith: c.totalHadith });
    setFormError(""); setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.book || !form.chapter_number || !form.name_ar || !form.name_en || !form.name_mm) {
      setFormError("All fields except Total Hadith are required."); return;
    }
    editingId ? onUpdate(editingId, form) : onAdd(form);
    setModalOpen(false);
  };

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={styles.topbar}>
        <div>
          <div style={styles.title}>Hadith Chapters</div>
          <div style={styles.sub}>Manage chapters by book</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Chapter</button>
      </div>

      <div style={styles.content}>
        {/* Book selector */}
        <div style={styles.selectorBar}>
          <span style={styles.selectorLabel}>Book:</span>
          <select className="select-input" value={selectedBookId}
            onChange={(e) => { setSelectedBookId(e.target.value); setPage(1); setSearch(""); }}>
            {books.map((b) => (
              <option key={b._id} value={b._id}>{b.book_number}. {b.name_en}</option>
            ))}
          </select>
          <input className="search-input" placeholder="Search chapter..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              {currentBook ? `${currentBook.name_en} — ${currentBook.name_ar}` : "Chapters"}
            </div>
            <span className="badge badge-gold">{filtered.length} chapters</span>
          </div>
          <table>
            <thead>
              <tr><th>#</th><th>Arabic</th><th>English</th><th>Myanmar</th><th>Hadiths</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={6} style={styles.empty}>No chapters found</td></tr>
              ) : slice.map((c) => (
                <tr key={c._id}>
                  <td><span className="badge badge-gold">{c.chapter_number}</span></td>
                  <td className="td-ar">{c.name_ar}</td>
                  <td className="td-main">{c.name_en}</td>
                  <td style={{ fontSize: 12 }}>{c.name_mm}</td>
                  <td><span className="badge badge-blue">{c.totalHadith}</span></td>
                  <td>
                    <div className="action-cell">
                      <button className="btn btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => { setDelTarget(c); setDelOpen(true); }}>Delete</button>
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
        title={editingId ? "Edit Chapter" : "Add Chapter"}
        subtitle="Fill in the chapter details below."
        footer={<><button className="btn" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save Chapter</button></>}
      >
        <div style={styles.formGrid}>
          <div className="field-wrap">
            <label className="field-label">Book</label>
            <select className="field-input select-input" value={form.book as string}
              onChange={(e) => set("book", e.target.value)}>
              {books.map((b) => <option key={b._id} value={b._id}>{b.book_number}. {b.name_en}</option>)}
            </select>
          </div>
          <div className="field-wrap">
            <label className="field-label">Chapter Number</label>
            <input className="field-input" type="number" min={1} value={form.chapter_number || ""}
              onChange={(e) => set("chapter_number", parseInt(e.target.value))} placeholder="e.g. 1" />
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Arabic Name</label>
            <input className="field-input" type="text" value={form.name_ar}
              onChange={(e) => set("name_ar", e.target.value)} placeholder="e.g. كتاب الإيمان"
              style={{ direction: "rtl", fontSize: 18 }} />
          </div>
          <div className="field-wrap">
            <label className="field-label">English Name</label>
            <input className="field-input" type="text" value={form.name_en}
              onChange={(e) => set("name_en", e.target.value)} placeholder="e.g. The Book of Faith" />
          </div>
          <div className="field-wrap">
            <label className="field-label">Myanmar Name</label>
            <input className="field-input" type="text" value={form.name_mm}
              onChange={(e) => set("name_mm", e.target.value)} placeholder="Myanmar name..." />
          </div>
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Total Hadith</label>
            <input className="field-input" type="number" min={0} value={form.totalHadith || ""}
              onChange={(e) => set("totalHadith", parseInt(e.target.value))} placeholder="0" />
          </div>
        </div>
        {formError && <div style={styles.formError}>{formError}</div>}
      </Modal>

      {/* Delete Modal */}
      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="Delete Chapter" danger width={360}
        footer={<><button className="btn" onClick={() => setDelOpen(false)}>Cancel</button><button className="btn btn-danger" onClick={() => { if (delTarget?._id) onDelete(delTarget._id); setDelOpen(false); }}>Delete</button></>}
      >
        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Delete chapter <strong style={{ color: "var(--text)" }}>{delTarget?.name_en}</strong>? This cannot be undone.
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
  selectorBar: { display: "flex", gap: 10, alignItems: "center", marginBottom: 20 },
  selectorLabel: { fontSize: 12, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" },
  formError: { color: "var(--danger)", fontSize: 12, marginTop: 8 },
  empty: { textAlign: "center", color: "var(--text3)", padding: 32 },
};

export default HadithChaptersPage;
