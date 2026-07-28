// login.jsx — Anmeldebildschirm

function LoginScreen({ onLogin }) {
  const [name,    setName]    = React.useState("Peter");
  const [pw,      setPw]      = React.useState("");
  const [error,   setError]   = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const submit = () => {
    if (pw.toLowerCase() === "klusa") {
      setLoading(true);
      setTimeout(() => onLogin(name || "Peter"), 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="login-root">
      <div className={"login-card" + (loading ? " login-card-out" : "")}>
        <img src="assets/klusa-logo.png" className="login-logo" alt="KLUSA" />
        <h2 className="login-title">Willkommen zurück</h2>

        <div className="login-fields">
          <label className="login-label">Name</label>
          <input className="login-input" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ihr Name" />

          <label className="login-label">Passwort</label>
          <input className="login-input" type="password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && submit()}
            placeholder="Passwort eingeben"
            autoFocus />

          {error && <div className="login-error">Passwort falsch. Tipp: klusa</div>}
        </div>

        <button className="login-btn" onClick={submit} disabled={loading}>
          {loading ? "Wird geladen …" : "Anmelden →"}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen });
