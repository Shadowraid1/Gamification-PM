// zeit.jsx — Zeiterfassung (MeinKLUSA).
// Keine Gamification (kein täglicher Streak auf Einzelpersonen). Stattdessen eine
// faire Erinnerung: zustandsabhängig (nur bei echten Lücken), leise (nicht-blockierend)
// und zum Perioden-Stichtag eskalierend. Buchen ist per Ein-Klick möglich.

const ZEIT_TABS = ["Kalender","Projektaufwände","Zeiterfassung","Zusammenfassung","Stellvertreter","Standort","Arbeitsunfähigkeit"];

// Demo: Tage bis zum Stichtag je Stufe (steuert die Eskalation sichtbar)
const DEADLINE_STEPS = [
  { key:"offen",   days:6, label:"früh (6 Tage)" },
  { key:"bald",    days:2, label:"Stichtag naht (2 Tage)" },
  { key:"faellig", days:0, label:"Stichtag erreicht" },
];

function ZeitEntryForm({ target, onClose, onSubmit }) {
  const [hours, setHours] = React.useState(target || "8:00");
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

// Persönliche Erinnerungseinstellungen – bewusst pro Person, nicht zentral erzwungen.
function ReminderSettings({ reminder, onChange, onClose, onSimulate }) {
  return (
    <div className="rem-settings" onClick={e => e.stopPropagation()}>
      <div className="rem-set-head">
        <span>Erinnerung an Zeitbuchung</span>
        <button className="kprofile-x" onClick={onClose}>✕</button>
      </div>

      <label className="rem-opt">
        <input type="checkbox" checked={reminder.enabled}
          onChange={e => onChange({ ...reminder, enabled:e.target.checked })}/>
        <span>
          <span className="kpo-lbl">Erinnerung aktiv</span>
          <span className="kpo-sub">Nur wenn tatsächlich Tage offen sind</span>
        </span>
      </label>

      <div className={"rem-sub-block" + (reminder.enabled ? "" : " disabled")}>
        <div className="rem-row">
          <span className="rem-row-lbl">Uhrzeit</span>
          <input className="rem-time" type="time" value={reminder.time}
            disabled={!reminder.enabled}
            onChange={e => onChange({ ...reminder, time:e.target.value })}/>
          <span className="rem-row-hint">selbst wählbar</span>
        </div>

        <div className="rem-row rem-mode">
          <button className={"rem-mode-btn" + (reminder.mode==="leise" ? " active" : "")}
            disabled={!reminder.enabled}
            onClick={() => onChange({ ...reminder, mode:"leise" })}>
            Leise
            <span className="rem-mode-sub">nur Hinweis in der App</span>
          </button>
          <button className={"rem-mode-btn" + (reminder.mode==="aktiv" ? " active" : "")}
            disabled={!reminder.enabled}
            onClick={() => onChange({ ...reminder, mode:"aktiv" })}>
            Aktiv
            <span className="rem-mode-sub">zusätzlich Benachrichtigung</span>
          </button>
        </div>
      </div>

      <button className="rem-sim" onClick={onSimulate} disabled={!reminder.enabled}>
        Erinnerung jetzt testen
      </button>
      <p className="rem-note">
        Die Erinnerung kommt nie bei Urlaub, Krankheit oder bereits gebuchtem Tag –
        und blockiert die Arbeit nicht.
      </p>
    </div>
  );
}

function ZeitScreen({ onOpenDaysChange }) {
  const [entryOpen, setEntryOpen] = React.useState(false);
  const [rows, setRows]           = React.useState(ZEIT_ROWS);
  const [filled, setFilled]       = React.useState(false);
  const [reminder, setReminder]   = React.useState(REMINDER_DEFAULTS);
  const [setOpen, setSetOpen]     = React.useState(false);
  const [stepIdx, setStepIdx]     = React.useState(0);      // Demo-Eskalationsstufe
  const [toast, setToast]         = React.useState(null);

  const openDays  = countOpenTimeDays(rows);
  const daysLeft  = DEADLINE_STEPS[stepIdx].days;
  const level     = reminderLevel(daysLeft);

  // Zielstunden und letzten gebuchten Wert für die Schnellbuchung ermitteln
  const pendingRow = rows.find(r => r.pending);
  const target     = pendingRow ? pendingRow.ziel : "8:00";
  const lastBooked = [...rows].reverse().find(r => r.erf && !r.off && !r.holiday && !r.sum && !r.pending);
  const lastVal    = lastBooked ? lastBooked.erf : null;

  // Modul- und Reiter-Badge aktuell halten
  React.useEffect(() => { onOpenDaysChange && onOpenDaysChange(openDays); }, [openDays]);

  const book = hours => {
    setEntryOpen(false);
    setFilled(true);
    setRows(r => r.map(row => row.pending
      ? { ...row, erf:hours, diff:"0:00", pt:"1,00", ges:hours, pending:false, isNew:true }
      : row));
  };

  const simulate = () => {
    setSetOpen(false);
    if (openDays === 0) { setToast("Nichts zu erinnern – diese Periode ist vollständig gebucht."); return; }
    setToast("Erinnerung (" + reminder.time + "): " + openDays + " Tag" + (openDays>1?"e":"") +
             " in dieser Periode noch offen. Ein Klick genügt zum Buchen.");
  };

  const bannerText = () => {
    const d = openDays, tage = d + (d===1 ? " Tag" : " Tage");
    if (level === "faellig")
      return { title:"Stichtag erreicht – " + tage + " noch offen",
        sub:"Zum „" + PERIOD_DEADLINE.label + "\u201c fehlt noch eine Buchung. Im Modus „Aktiv\u201c ginge jetzt zusätzlich eine Benachrichtigung an dich." };
    if (level === "bald")
      return { title:tage + " noch offen · Stichtag in " + daysLeft + " Tagen",
        sub:"Kurz gebucht, dann ist die Periode vollständig." };
    return { title:tage + " in dieser Periode noch offen",
      sub:"Stichtag in " + daysLeft + " Tagen. Jetzt schnell buchen." };
  };

  return (
    <div className="klusa-screen zeit-screen">
      <div className="ktabs ktabs-magenta">
        {ZEIT_TABS.map((tb,i) => (
          <button key={tb} className={"ktab" + (i === 2 ? " active" : "")}>
            {tb}
            {i === 2 && openDays > 0 && reminder.enabled && (
              <span className={"tab-badge lvl-" + level}>{openDays}</span>
            )}
          </button>
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
          <div className="rem-set-wrap">
            <button className={"rem-gear" + (reminder.enabled ? " on" : "")}
              onClick={() => setSetOpen(o => !o)} title="Erinnerung einstellen">
              <Icon name="info" size={14}/> Erinnerung {reminder.enabled ? reminder.time : "aus"}
            </button>
            {setOpen && (
              <ReminderSettings reminder={reminder} onChange={setReminder}
                onClose={() => setSetOpen(false)} onSimulate={simulate}/>
            )}
          </div>
          <button className={"zeit-entry-btn" + (filled ? " done" : "")}
            onClick={() => !filled && setEntryOpen(o => !o)}>
            {filled
              ? <><Icon name="check" size={14}/> Eingetragen</>
              : <><Icon name="plusC" size={14}/> Stunden eintragen</>}
          </button>
        </div>
      </div>

      {/* Zustandsabhängiger, nicht-blockierender Hinweis */}
      {reminder.enabled && openDays > 0 && (
        <div className={"rem-banner lvl-" + level}>
          <div className="rem-banner-icon">
            {level === "faellig" ? <Icon name="alert" size={18} stroke={2.2}/> : <Icon name="info" size={18}/>}
          </div>
          <div className="rem-banner-txt">
            <div className="rem-banner-title">{bannerText().title}</div>
            <div className="rem-banner-sub">{bannerText().sub}</div>
          </div>
          <div className="rem-banner-actions">
            <button className="rem-act primary" onClick={() => book(target)}>
              <Icon name="check" size={13}/> {target} übernehmen
            </button>
            {lastVal && lastVal !== target && (
              <button className="rem-act" onClick={() => book(lastVal)}>Letzter Tag ({lastVal})</button>
            )}
            <button className="rem-act ghost" onClick={() => setEntryOpen(true)}>Andere Zeit …</button>
          </div>
        </div>
      )}

      {/* Alles gebucht → ruhige Bestätigung statt Dauer-Nörgeln */}
      {reminder.enabled && openDays === 0 && (
        <div className="rem-banner lvl-clear">
          <div className="rem-banner-icon"><Icon name="check" size={18} stroke={2.2}/></div>
          <div className="rem-banner-txt">
            <div className="rem-banner-title">Diese Periode ist vollständig gebucht</div>
            <div className="rem-banner-sub">Keine Erinnerung nötig – nichts weiter zu tun.</div>
          </div>
        </div>
      )}

      {entryOpen && (
        <div className="zeit-entry-wrap">
          <ZeitEntryForm target={target} onClose={() => setEntryOpen(false)} onSubmit={book}/>
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

      {/* Demo-Steuerung: Eskalationsstufe umschalten */}
      <div className="rem-demo">
        <span className="rem-demo-lbl">Demo · Stichtag:</span>
        {DEADLINE_STEPS.map((s,i) => (
          <button key={s.key} className={"rem-demo-btn" + (i===stepIdx ? " active" : "")}
            onClick={() => setStepIdx(i)}>{s.label}</button>
        ))}
        {filled && (
          <button className="rem-demo-btn reset"
            onClick={() => { setRows(ZEIT_ROWS); setFilled(false); }}>Buchung zurücksetzen</button>
        )}
      </div>

      <p className="zeit-streak-note">
        <Icon name="info" size={13}/>
        Bewusst kein täglicher Streak auf Einzelpersonen – das erzeugt Druck und bestraft Urlaub
        oder Krankheit. Die Erinnerung kommt nur bei echten Lücken, blockiert nicht und wird erst
        zum Perioden-Stichtag deutlicher.
      </p>

      {toast && <InlineToast text={toast} onDone={() => setToast(null)}/>}
    </div>
  );
}

Object.assign(window, { ZeitScreen });
