import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  danger?: boolean;
}

const Modal: React.FC<Props> = ({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  width = 480,
  danger,
}) => {
  if (!open) return null;

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ ...styles.modal, width }}>
        <div
          style={{
            ...styles.title,
            color: danger ? "var(--danger)" : "var(--text)",
          }}
        >
          {title}
        </div>
        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
        {children}
        {footer && <div style={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.72)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    background: "var(--surface)",
    border: "0.5px solid var(--border2)",
    borderRadius: 16,
    padding: 28,
    maxWidth: "95vw",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "var(--text3)",
    marginBottom: 24,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
    paddingTop: 16,
    borderTop: "0.5px solid var(--border)",
  },
};

export default Modal;
