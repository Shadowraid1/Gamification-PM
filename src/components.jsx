// components.jsx — geteilte Bausteine

const ICONS = {
  save: "M5 4h11l4 4v12H5z M8 4v5h7 M8 14h8v6H8z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7 M20 5v6h-6",
  chevL: "M15 6l-6 6 6 6", chevR: "M9 6l6 6-6 6",
  dchevL: "M13 6l-6 6 6 6 M19 6l-6 6 6 6", dchevR: "M11 6l6 6-6 6 M5 6l6 6-6 6",
  caret: "M6 9l6 6 6-6",
  plusC: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 8v8 M8 12h8",
  plusS: "M5 5h14v14H5z M12 9v6 M9 12h6",
  pencil: "M4 20l4-1 11-11-3-3L5 16l-1 4z M14 5l3 3",
  delete: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12h8",
  funnel: "M3 5h18l-7 8v6l-4-2v-4z",
  zoomIn: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-4.3-4.3 M11 8v6 M8 11h6",
  zoomOut: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M21 21l-4.3-4.3 M8 11h6",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  print: "M6 9V3h12v6 M6 18H4v-7h16v7h-2 M8 14h8v7H8z",
  calendar: "M4 7h16v13H4z M4 7V5h16v2 M8 3v4 M16 3v4 M4 12h16",
  comment: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
  info: "M12 11v5 M12 7.5v.5 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  check: "M5 12l4 4 10-10",
  x: "M6 6l12 12 M18 6L6 18",
  alert: "M12 8v5 M12 16.5v.5 M10.3 3.9l-8 14A1.5 1.5 0 0 0 3.7 20h16.6a1.5 1.5 0 0 0 1.4-2.1l-8-14a1.6 1.6 0 0 0-2.8 0z",
  arrowR: "M5 12h14 M13 6l6 6-6 6",
  chevDown: "M6 9l6 6 6-6",
  expand: "M6 9l6 6 6-6",
  send: "M4 12l16-8-6 16-2.5-6z",
  flag: "M5 21V4 M5 4h11l-2 4 2 4H5",
  clap: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.5 12.5l2.5 2.5 4.5-5",
};

function Icon({ name, size = 16, stroke = 1.7, className = "", style = {} }) {
  const d = ICONS[name] || ICONS.info;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }} aria-hidden="true">
      {d.split(" M").map((seg, i) => (<path key={i} d={(i === 0 ? seg : "M" + seg)} />))}
    </svg>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────
function Avatar({ id, size = 30 }) {
  const m = memberById(id);
  return (
    <span className="kav" title={m.name}
      style={{ width:size, height:size, background:m.color, fontSize: size * 0.38 }}>
      {m.avatar}
    </span>
  );
}

// ─── Fortschrittsbalken ──────────────────────────────────────────
// Die Farbe kommt nicht aus der reinen Prozentzahl, sondern aus dem Abstand
// zum Soll-Fortschritt. Der kleine Strich im Balken zeigt genau diesen Soll-Wert.
function ProgressBar({ pct, width = 90, height = 8, showPct = true, zoneColor, plan = null, title }) {
  const color = zoneColor || progressZone(pct).color;
  return (
    <span className="pbar-wrap" title={title}>
      <span className="pbar-track" style={{ width, height }}>
        <span className="pbar-fill" style={{ width: pct + "%", background: color }} />
        {plan != null && plan > 0 && plan < 100 && (
          <span className="pbar-plan" style={{ left: plan + "%" }}
            title={"Soll heute: " + plan + " %"} />
        )}
      </span>
      {showPct && <span className="pbar-pct" style={{ color }}>{pct}%</span>}
    </span>
  );
}

// ─── Status-Chip (Ampel im Klartext) ─────────────────────────────
function StatusChip({ st, compact = false }) {
  return (
    <span className={"st-chip st-" + st.key} title={wpStatusText(st)}>
      <span className="st-dot" style={{ background: st.color }} />
      {compact ? st.short : st.label}
      {st.key === "warn" || st.key === "crit" ? (
        <b className="st-delta">{-st.delta} % Rückstand</b>
      ) : null}
    </span>
  );
}

// ─── Fortschrittsring ────────────────────────────────────────────
function ProgressRing({ pct, size = 104, zone: zoneIn, plan = null }) {
  const zone = zoneIn || progressZone(pct);
  const r = size * 0.38, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  const planAngle = plan != null ? (plan / 100) * 360 - 90 : null;
  const planPt = planAngle == null ? null : {
    x1: size/2 + Math.cos(planAngle*Math.PI/180) * (r - size*0.06),
    y1: size/2 + Math.sin(planAngle*Math.PI/180) * (r - size*0.06),
    x2: size/2 + Math.cos(planAngle*Math.PI/180) * (r + size*0.06),
    y2: size/2 + Math.sin(planAngle*Math.PI/180) * (r + size*0.06),
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--track)" strokeWidth={size*0.09}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={zone.color}
        strokeWidth={size*0.09} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:"stroke-dasharray .6s cubic-bezier(.2,.8,.2,1), stroke .35s" }}/>
      {planPt && <line x1={planPt.x1} y1={planPt.y1} x2={planPt.x2} y2={planPt.y2}
        stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" opacity=".55"><title>{"Soll heute: " + plan + " %"}</title></line>}
      <text x={size/2} y={size/2-3} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize:size*.24, fontWeight:700, fill:zone.color, fontVariantNumeric:"tabular-nums", fontFamily:"inherit" }}>{pct}</text>
      <text x={size/2} y={size/2+size*.15} textAnchor="middle"
        style={{ fontSize:size*.1, fill:"var(--muted)", fontFamily:"inherit" }}>%</text>
    </svg>
  );
}

// ─── Kudos-Button ────────────────────────────────────────────────
// Anerkennung durch Kollegen: kein Punktestand, keine Rangliste.
// Eigene Beiträge kann man nicht selbst würdigen.
function KudosButton({ kudos = [], onToggle, own = false, compact = false }) {
  const mine  = kudos.includes(ME);
  const names = kudos.map(id => memberById(id).short);
  const title = own
    ? "Eigene Beiträge kann man nicht selbst würdigen"
    : names.length
      ? names.join(", ") + (mine ? " (inkl. dir)" : "") + " fanden das stark"
      : "Kudos geben";
  return (
    <button
      className={"kudos-btn" + (mine ? " given" : "") + (own ? " own" : "") + (compact ? " compact" : "")}
      onClick={own ? undefined : onToggle} disabled={own} title={title}>
      <span className="kb-emoji">👏</span>
      <span className="kb-count">{kudos.length}</span>
      {!compact && <span className="kb-lbl">{mine ? "Kudos gegeben" : "Kudos"}</span>}
    </button>
  );
}

// ─── Kudos-Empfängerleiste ───────────────────────────────────────
function KudosFaces({ kudos = [] }) {
  if (!kudos.length) return null;
  return (
    <span className="kudos-faces">
      {kudos.slice(0, 5).map(id => <Avatar key={id} id={id} size={19}/>)}
      {kudos.length > 5 && <span className="kf-more">+{kudos.length - 5}</span>}
    </span>
  );
}

// ─── Infohinweis ─────────────────────────────────────────────────
function InfoDot({ text }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="info-dot-wrap">
      <button className="info-dot" onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        aria-label="Was bedeutet das?">
        <Icon name="info" size={13}/>
      </button>
      {open && (
        <span className="info-pop" onClick={e => e.stopPropagation()}>
          {text}
          <button className="info-pop-x" onClick={() => setOpen(false)}>✕</button>
        </span>
      )}
    </span>
  );
}

// ─── Sachliche Rückmeldung (kein Lob, nur Information) ───────────
function InlineToast({ text, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 5000); return () => clearTimeout(t); }, []);
  return (
    <div className="inline-toast" onClick={onDone}>
      <Icon name="check" size={15}/>
      <span>{text}</span>
    </div>
  );
}

// ─── Feiermoment (klein, teambezogen, selbst-schließend) ─────────
function MomentumOverlay({ emoji, title, sub, streak, accent, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 5200); return () => clearTimeout(t); }, []);
  return (
    <div className="celeb-overlay" onClick={onDone}>
      <div className="celeb-card" onClick={e => e.stopPropagation()}
        style={accent ? { "--progress": accent, "--streak": accent } : undefined}>
        {/* Konfetti läuft bewusst schnell durch: kurzer Moment, dann ist der Blick wieder frei. */}
        <div className="celeb-confetti">
          {Array.from({length:18}).map((_,i) => (
            <span key={i} className={"cfp cfp-"+(i%4)}
              style={{ left:(3+i*5.4)+"%",
                       animationDelay:(i%6*0.03)+"s",
                       animationDuration:(0.85 + (i%5)*0.07)+"s" }}/>
          ))}
        </div>
        <div className="celeb-emoji">{emoji}</div>
        <h2 className="celeb-title">{title}</h2>
        <p className="celeb-sub">{sub}</p>
        {streak != null && streak > 1 && (
          <div className="celeb-streak">
            <span className="cs-num">{streak}</span>
            <span className="cs-lbl">Sprints in Folge im Zeitplan</span>
          </div>
        )}
        <button className="celeb-btn" onClick={e => { e.stopPropagation(); onDone(); }}>Weiter</button>
      </div>
    </div>
  );
}

// ─── Team-Momentum-Leiste ────────────────────────────────────────
// Serie auf Teamebene: kein Personenvergleich, keine Rangliste.
function TeamMomentum({ sprints, current, compact = false }) {
  const streak = computeTeamStreak(sprints);
  return (
    <div className={"momentum" + (compact ? " compact" : "")}>
      <div className="mom-head">
        <span className="mom-streak">
          <span className="mom-num">{streak}</span>
          <span className="mom-lbl">Sprints in Folge im Zeitplan</span>
        </span>
        {!compact && (
          <span className="mom-best">
            Bestwert: {Math.max(BEST_STREAK, streak)}
            <InfoDot text="Die Serie zählt für das gesamte Projektteam, nicht für einzelne Personen. Sie wird nicht ausgewertet und fließt in keine Leistungsbeurteilung ein. Bricht sie, passiert nichts weiter – sie startet einfach neu."/>
          </span>
        )}
      </div>
      <div className="mom-track">
        {sprints.map(s => (
          <span key={s.id} className={"mom-dot " + (s.onTime ? "md-ok" : "md-late")} title={s.label + (s.onTime ? " – im Zeitplan" : " – verzögert")}/>
        ))}
        {current && <span className="mom-dot md-now" title={current.label + " – läuft"}/>}
      </div>
      {!compact && current && (
        <div className="mom-foot">{current.label} läuft · noch {current.daysLeft} Tage</div>
      )}
    </div>
  );
}

Object.assign(window, {
  Icon, Avatar, ProgressBar, ProgressRing, StatusChip,
  KudosButton, KudosFaces, InfoDot, InlineToast,
  MomentumOverlay, TeamMomentum,
});
