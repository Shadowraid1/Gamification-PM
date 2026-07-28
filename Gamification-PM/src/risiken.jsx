// risiken.jsx — normale Projektdaten, bewusst nicht gamifiziert

function RisikenScreen() {
  return (
    <div className="rk-screen">
      <div className="rk-head">
        <div>
          <h3 className="rk-title">Risiken &amp; Chancen</h3>
          <span className="rk-sub">{RISK_ROWS.length} erfasst</span>
        </div>
      </div>

      <div className="rk-table">
        <div className="rk-row rk-row-head">
          <div className="rk-c">ID</div>
          <div className="rk-c">Risiko</div>
          <div className="rk-c">Wahrsch.</div>
          <div className="rk-c">Auswirkung</div>
          <div className="rk-c">Gegenmaßnahme</div>
          <div className="rk-c">Verantwortlich</div>
        </div>
        {RISK_ROWS.map(r => (
          <div key={r.id} className="rk-row">
            <div className="rk-c">{r.id}</div>
            <div className="rk-c rk-c-name">
              <span className={"rk-sev rk-sev-" + r.severity}/>{r.name}
            </div>
            <div className="rk-c">{r.probability}</div>
            <div className="rk-c">{r.impact}</div>
            <div className="rk-c">{r.measure}</div>
            <div className="rk-c">{r.owner}</div>
          </div>
        ))}
      </div>

      <p className="rk-note">
        Dieser Bereich ist bewusst nicht gamifiziert: Risikobewertung ist eine fachliche
        Einschätzung und sollte nicht durch Fortschritts- oder Anerkennungsanreize beeinflusst werden.
      </p>
    </div>
  );
}

Object.assign(window, { RisikenScreen });
