// zeit.jsx — Zeiterfassung (MeinKLUSA), bewusst ohne Gamification.
// Tägliche Serien auf Einzelpersonen erzeugen Druck und bestrafen Urlaub oder Fokuszeit.

const ZEIT_TABS = ["Kalender","Projektaufwände","Zeiterfassung","Zusammenfassung","Stellvertreter","Standort","Arbeitsunfähigkeit"];

function ZeitEntryForm({ onClose, onSubmit }) {
  const [hours, setHours] = React.useState("8:00");
  const [proj,  setProj]  = React.useState("HZE_Master_01");
  return (
    <div className="zeit-entry-form">
      <div className="zef-header">
        <span className="zef-title">Stunden eintragen – Mo 09.05.2022</span>
        <button className="zef-close" onClick={onClose}>✕</button>
      </div>
      <div className="zef-body">
        <div className="zef-row">
          <label className="zef-lbl">Arbeitsstunden</label>
          <input className="zef-input" value={hours} onChange={e => setHours(e.target.value)} autoFocus/>
        </div>
        <div className="zef-row">
          <label className="zef-lbl">Projekt</label>
          <select className="zef-sel" value={proj} onChange={e => setProj(e.target.value)}>
            <option>HZE_Master_01</option>
            <option>Keinem AP zugewiesen</option>
          </select>
        </div>
      </div>
      <div className="zef-foot">
        <button className="zef-cancel" onClick={onClose}>Abbrechen</button>
        <button className="zef-submit" onClick={() => onSubmit(hours)}>
          <Icon name="check" size={13}/> Eintragen
        </button>
      </div>
    </div>
  );
}

function ZeitScreen() {
  const [entryOpen, setEntryOpen] = React.useState(false);
  const [rows, setRows]           = React.useState(ZEIT_ROWS);
  const [filled, setFilled]       = React.useState(false);

  const handleSubmit = hours => {
    setEntryOpen(false);
    setFilled(true);
    setRows(r => r.map(row => row.pending
      ? { ...row, erf:hours, diff:"0:00", pt:"1,00", ges:hours, pending:false, isNew:true }
      : row));
  };

  return (
    <div className="klusa-screen zeit-screen">
      <div className="ktabs ktabs-magenta">
        {ZEIT_TABS.map((tb,i) => (
          <button key={tb} className={"ktab" + (i === 2 ? " active" : "")}>{tb}</button>
        ))}
      </div>

      <div className="ktoolbar">
        <button className="ktool kt-save-m"><Icon name="save"/></button>
        <span className="ktb-label">Periode</span>
        <button className="ktool kt-mut"><Icon name="dchevL"/></button>
        <button className="ktool kt-mut"><Icon name="chevL"/></button>
        <div className="kselect ks-sm">Mai 2022 <Icon name="caret" size={13}/></div>
        <button className="ktool kt-mut"><Icon name="chevR"/></button>
        <button className="ktool kt-mut"><Icon name="dchevR"/></button>
        <span className="ksep"/>
        <button className="ktool kt-cal"><Icon name="calendar"/></button>
        <button className="ktool kt-mut2"><Icon name="list"/></button>
        <span className="ktb-stat">Gleitzeit: <b>6:30</b></span>
        <span className="ktb-stat">Urlaub: <b>30,5 d</b></span>
        <div className="ktool-gami">
          <button className={"zeit-entry-btn" + (filled ? " done" : "")}
            onClick={() => !filled && setEntryOpen(o => !o)}>
            {filled
              ? <><Icon name="check" size={14}/> Eingetragen</>
              : <><Icon name="plusC" size={14}/> Stunden eintragen</>}
          </button>
        </div>
      </div>

      {entryOpen && (
        <div className="zeit-entry-wrap">
          <ZeitEntryForm onClose={() => setEntryOpen(false)} onSubmit={handleSubmit}/>
        </div>
      )}

      <div className="zeit-table">
        <div className="zt-head">
          <div className="ztc ztc-status">Status</div>
          <div className="ztc ztc-datum">Datum</div>
          <div className="ztc ztc-grund">Abwesenheitsgrund</div>
          <div className="ztc ztc-num">Zeiterfassungen [h]</div>
          <div className="ztc ztc-num">Differenz [h]</div>
          <div className="ztc ztc-num">Gesamt [PT]</div>
          <div className="ztc ztc-num">Gesamt [h]</div>
          <div className="ztc ztc-num">Ziel [h]</div>
        </div>
        <div className="zt-body">
          {rows.map((r,i) => (
            <div key={i} className={"zt-row"+(r.sum?" zt-sum":"")+(r.holiday?" zt-holiday":"")+(r.off?" zt-off":"")+(r.needsAttention&&!r.isNew?" zt-attn":"")+(r.pending?" zt-pending":"")+(r.isNew?" zt-new":"")}>
              <div className="ztc ztc-status">
                {r.needsAttention && !r.isNew && <span className="zt-flag"><Icon name="alert" size={11} stroke={2.4}/></span>}
                {r.isNew && <span className="zt-ok"><Icon name="check" size={11} stroke={2.4}/></span>}
                {r.pending && !r.isNew && <span className="zt-pending-dot"/>}
              </div>
              <div className={"ztc ztc-datum"+(r.datumRed&&!r.isNew?" datum-red":"")}>{r.datum||""}</div>
              <div className="ztc ztc-grund">{r.grund||""}</div>
              <div className={"ztc ztc-num"+(r.off||r.holiday||(r.pending&&!r.isNew)?" muted":"")}>{r.erf||(r.pending?"–":"0:00")}</div>
              <div className={"ztc ztc-num"+(r.off||r.holiday?" muted":r.pending&&!r.isNew?" muted":r.diffNeg?" neg":r.diff?" pos":"")}>{r.diff||(r.pending?"–":"0:00")}</div>
              <div className={"ztc ztc-num"+(r.off||r.holiday||(r.pending&&!r.isNew)?" muted":"")}>{r.pt||(r.pending?"–":"0,00")}</div>
              <div className={"ztc ztc-num"+(r.off||r.holiday||(r.pending&&!r.isNew)?" muted":"")}>{r.ges||(r.pending?"–":"0:00")}</div>
              <div className={"ztc ztc-num"+(r.off||r.holiday?" muted":"")}>{r.ziel||"0:00"}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="zeit-streak-note">
        <Icon name="info" size={13}/>
        Die Zeiterfassung ist bewusst nicht gamifiziert. Tägliche Serien auf Einzelpersonen
        erzeugen Druck und bestrafen Urlaub, Krankheit oder Fokuszeit.
      </p>
    </div>
  );
}

Object.assign(window, { ZeitScreen });
