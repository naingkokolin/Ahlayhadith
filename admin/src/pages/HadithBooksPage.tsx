import React, { useState, useMemo, useEffect } from "react";
import { getRefId, IHadithBible, IHadithBook } from "../types";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

interface Props {
  bibles: IHadithBible[];
  books: IHadithBook[];
  onAdd: (book: Omit<IHadithBook, "_id">) => void;
  onUpdate: (id: string, book: Omit<IHadithBook, "_id">) => void;
  onDelete: (id: string) => void;
}

const PER_PAGE = 8;

const EMPTY = (bibleId: string): Omit<IHadithBook, "_id"> => ({
  bible: bibleId,
  book_number: 0,
  name_ar: "",
  name_mm: "",
  name_en: "",
  // author: "",
  // totalHadith: 0,
});

const HadithBooksPage: React.FC<Props> = ({
  bibles = [],
  books = [],
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [selectedBibleId, setSelectedBibleId] = useState(""); // bibles[0]?._id ?? ""
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delTarget, setDelTarget] = useState<IHadithBook | null>(null);
  const [form, setForm] = useState<Omit<IHadithBook, "_id">>(
    EMPTY(selectedBibleId),
  );
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (bibles.length > 0 && !selectedBibleId) {
      setSelectedBibleId(bibles[0]._id as string);
    }
  }, [bibles, selectedBibleId]);

  useEffect(() => {
    if (selectedBibleId) {
      setForm(EMPTY(selectedBibleId));
    }
  }, [selectedBibleId]);

  if (bibles.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div>Loading bibles... please wait</div>
      </div>
    );
  }

  // console.log(`Bilessss: ${bibles.length}`);

  const currentBible = bibles.find((b) => b._id === selectedBibleId);

  const filtered = useMemo(() => {
    const bibleBooks = books.filter(
      (b) => getRefId(b.bible) === selectedBibleId,
    );
    const q = search.toLowerCase();
    return q
      ? bibleBooks.filter(
          (b) =>
            b.name_en.toLowerCase().includes(q) ||
            b.name_ar.includes(q) ||
            b.name_mm.includes(q) ||
            // b.author.toLowerCase().includes(q) ||
            String(b.book_number).includes(q),
        )
      : bibleBooks;
  }, [books, selectedBibleId, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY(selectedBibleId));
    setFormError("");
    setModalOpen(true);
  };
  const openEdit = (b: IHadithBook) => {
    setEditingId(b._id ?? null);
    setForm({
      // bible: b.bible,
      bible: getRefId(b.bible),
      book_number: b.book_number,
      name_ar: b.name_ar,
      name_mm: b.name_mm,
      name_en: b.name_en,
      // author: b.author,
      // totalHadith: b.totalHadith,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    if (
      !form.bible ||
      !form.book_number ||
      !form.name_ar ||
      !form.name_en ||
      !form.name_mm
      // !form.author
    ) {
      setFormError("All fields except Total Hadith are required.");
      return;
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
          <div style={styles.title}>Hadith Books</div>
          <div style={styles.sub}>Manage hadith book collections</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Book
        </button>
      </div>

      <div style={styles.content}>
        {/* Book selector */}
        <div style={styles.selectorBar}>
          <span style={styles.selectorLabel}>Book:</span>
          <select
            className="select-input"
            value={selectedBibleId}
            onChange={(e) => {
              setSelectedBibleId(e.target.value);
              setPage(1);
              setSearch("");
            }}
          >
            {bibles.map((b) => (
              <option key={b._id} value={b._id}>
                {b.bible_number}. {b.name_en}
              </option>
            ))}
          </select>
          <input
            className="search-input"
            placeholder="Search book..."
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
              {/* All Books{" "} */}
              {currentBible
                ? `${currentBible.name_en} - ${currentBible.name_ar}`
                : "Books"}
              <span className="badge badge-gold" style={{ marginLeft: 8 }}>
                {filtered.length} books
              </span>
            </div>
            <input
              className="search-input"
              placeholder="Search book..."
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
                {/* <th>Author</th>
                <th>Hadiths</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.empty}>
                    No books found
                  </td>
                </tr>
              ) : (
                slice.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="badge badge-gold">{b.book_number}</span>
                    </td>
                    <td className="td-ar">{b.name_ar}</td>
                    <td className="td-main">{b.name_en}</td>
                    <td>{b.name_mm}</td>
                    {/* <td style={{ color: "var(--text)", fontSize: 12 }}>
                      {b.author}
                    </td>
                    <td>
                      <span className="badge badge-blue">{b.totalHadith}</span>
                    </td> */}
                    <td>
                      <div className="action-cell">
                        <button
                          className="btn btn-sm"
                          onClick={() => openEdit(b)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setDelTarget(b);
                            setDelOpen(true);
                          }}
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
        title={editingId ? "Edit Hadith Book" : "Add Hadith Book"}
        subtitle="Fill in the book details below."
        footer={
          <>
            <button className="btn" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Book
            </button>
          </>
        }
      >
        <div style={styles.formGrid}>
          <div className="field-wrap">
            <label className="field-label">Bible</label>
            <select
              className="field-input select-input"
              value={form.bible as string}
              onChange={(e) => set("bible", e.target.value)}
            >
              {bibles.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.bible_number}. {b.name_en}
                </option>
              ))}
            </select>
          </div>
          <div className="field-wrap">
            <label className="field-label">Book Number</label>
            <input
              className="field-input"
              type="number"
              min={1}
              value={form.book_number || ""}
              onChange={(e) => set("book_number", parseInt(e.target.value))}
              placeholder="e.g. 1"
            />
          </div>
          {/* <div className="field-wrap">
            <label className="field-label">Total Hadith</label>
            <input
              className="field-input"
              type="number"
              min={0}
              value={form.totalHadith || ""}
              onChange={(e) => set("totalHadith", parseInt(e.target.value))}
              placeholder="e.g. 7563"
            />
          </div> */}
          <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Arabic Name</label>
            <input
              className="field-input"
              type="text"
              value={form.name_ar}
              onChange={(e) => set("name_ar", e.target.value)}
              placeholder="e.g. صحيح البخاري"
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
              placeholder="e.g. Sahih al-Bukhari"
            />
          </div>
          <div className="field-wrap">
            <label className="field-label">Myanmar Name</label>
            <input
              className="field-input"
              type="text"
              value={form.name_mm}
              onChange={(e) => set("name_mm", e.target.value)}
              placeholder="Myanmar name..."
            />
          </div>
          {/* <div className="field-wrap" style={{ gridColumn: "span 2" }}>
            <label className="field-label">Author</label>
            <input
              className="field-input"
              type="text"
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="e.g. Imam Bukhari"
            />
          </div> */}
        </div>
        {formError && <div style={styles.formError}>{formError}</div>}
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Delete Book"
        danger
        width={360}
        footer={
          <>
            <button className="btn" onClick={() => setDelOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (delTarget?._id) onDelete(delTarget._id);
                setDelOpen(false);
              }}
            >
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
            </strong>
            ?<br />
            All associated chapters and hadiths may be affected.
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
  title: { fontFamily: "var(--font-display)", fontSize: 20 },
  sub: { fontSize: 11, color: "var(--text3)", marginTop: 1, letterSpacing: 1 },
  content: { padding: 28 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" },
  formError: { color: "var(--danger)", fontSize: 12, marginTop: 8 },
  empty: { textAlign: "center", color: "var(--text3)", padding: 32 },
};

export default HadithBooksPage;
