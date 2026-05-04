import React, { useState } from "react";

interface Props {
  onLogin: () => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials. Try admin / admin123");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.screen}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.ornament}>بِسْمِ ٱللَّٰهِ</div>
        <div style={styles.subtitle}>Quran CMS · Admin</div>
        <hr style={styles.divider} />

        <div className="field-wrap">
          <label className="field-label">Username</label>
          <input
            className="field-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="admin"
          />
        </div>

        <div className="field-wrap">
          <label className="field-label">Password</label>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
          />
        </div>

        <button
          className="btn btn-primary"
          style={styles.loginBtn}
          onClick={handleLogin}
        >
          Sign In
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: 380,
    background: "var(--surface)",
    border: "0.5px solid var(--border2)",
    borderRadius: 20,
    padding: 40,
    position: "relative",
    zIndex: 1,
  },
  ornament: {
    textAlign: "center",
    fontFamily: "var(--font-display)",
    fontSize: 26,
    color: "var(--gold)",
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "var(--text2)",
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 32,
  },
  divider: {
    border: "none",
    borderTop: "0.5px solid var(--border)",
    marginBottom: 28,
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    justifyContent: "center",
    fontSize: 14,
    letterSpacing: 1,
  },
  error: {
    color: "var(--danger)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
};

export default LoginPage;
