// gantt.jsx — Projektmodul: Tab-Shell, gemeinsamer State, GANTT mit WP-Fortschritt

const PROJ_TABS = [
  { label:"GANTT Diagramm",  on:true },
  { label:"Aufgabenboard",   on:true },
  { label:"Team & Kudos",    on:true },
  { label:"Risiken Chancen", on:true },
  { label:"Ressourcenanfragen" },
  { label:"Dokumente" },
];
const NCOL = 9;

let feedSeq = 100;
const nextId = () => "f" + (++feedSeq);

// ─── Formular: Fortschritt eines Arbeitspakets setzen ────────────
function ProgressForm({ wp, value, onClose, onSave }) {
  const [v, setV] = React.useState(value);
  const delta = v - value;
  const rest  = 100 - v;
  return (
    <div className="ms-entry-wrap">
      <div className="ms-entry-form pf-form">
        <div className="zef-header">
          <span className="zef-title">{wp.name} – Fortschritt aktualisieren</span>
          <button className="zef-close" onClick={onClose}>✕</button>
        </div>
        <div className="zef-body">
          <div className="pf-readout">
            <span className="pf-big" style={{ color: progressZone(v).color }}>{v}%</span>
            <span className="pf-rest">{rest > 0 ? "noch " + rest + " % bis zum Abschluss" : "Arbeitspaket vollständig"}</span>
          </div>
          <input className="pf-range" type="range" min="0" max="100" step="1"
            value={v} onChange={e => setV(Number(e.target.value))} autoFocus/>
          <div className="pf-quick">
            {[0,25,50,75,100].map(q => (
              <button key={q} className={"pf-q" + (v===q ? " active" : "")} onClick={() => setV(q)}>{q}%</button>
            ))}
          </div>
          <div className="pf-hint">
            {v === 100
              ? <span className="pf-hint-ok">✓ Bei 100 % wird der zugehörige Meilenstein zur Bestätigung freigegeben.</span>
              : <span>Der Wert ist für alle Projektmitglieder sichtbar und fließt in den Projektfortschritt ein.</span>}
          </div>
        </div>
        <div className="zef-foot">
          <button className="zef-cancel" onClick={onClose}>Abbrechen</button>
          <button className="zef-submit" disabled={delta === 0} onClick={() => onSave(v)}>
            <Icon name="check" size={13}/> Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Formular: Meilenstein bestätigen ────────────────────────────
function MilestoneForm({ ms, onClose, onConfirm }) {
  const today = new Date().toLocaleDateString("de-DE", {day:"2-digit",month:"2-digit",year:"numeric"});
  const [date, setDate] = React.useState(today);
  return (
    <div className="ms-entry-wrap">
      <div className="ms-entry-form">
        <div className="zef-header">
          <span className="zef-title">{ms.emoji} {ms.name} – Datum bestätigen</span>
          <button className="zef-close" onClick={onClose}>✕</button>
        </div>
        <div className="zef-body">
          <div className="zef-row">
            <label className="zef-lbl">Erreicht am</label>
            <input className="zef-input" style={{width:130}} value={date}
              onChange={e => setDate(e.target.value)} autoFocus/>
          </div>
          <div className="pf-hint">
            Alle Arbeitspakete zu diesem Meilenstein sind abgeschlossen. Nach der Bestätigung
            erscheint der Meilenstein im Portfoliobericht.
          </div>
        </div>
        <div className="zef-foot">
          <button className="zef-cancel" onClick={onClose}>Abbrechen</button>
          <button className="zef-submit" onClick={() => onConfirm(date)}>
            <Icon name="check" size={13}/> Meilenstein bestätigen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Seitenpanel: Fortschritt aller Arbeitspakete ────────────────
function ProgressPanel({ progress, confirmed, onClose, onPick }) {
  const pct  = computeProjectProgress(progress);
  const zone = progressZone(pct);
  const doneWps = WORKPACKAGES.filter(w => (progress[w.id] ?? w.progress) === 100).length;
  return (
    <div className="score-panel">
      <div className="sp-header">
        <div>
          <div className="sp-title">Projektfortschritt</div>
          <div className="sp-zone" style={{color:zone.color}}>{zone.label}</div>
        </div>
        <button className="sp-close" onClick={onClose}>✕</button>
      </div>

      <div className="sp-ring-wrap">
        <ProgressRing pct={pct} size={104}/>
        <div className="sp-ring-aside">
          <b>{doneWps} von {WORKPACKAGES.length}</b>
          <span>Arbeitspaketen abgeschlossen</span>
          <span className="sp-ms-count">{confirmed.size} von {MILESTONES.length} Meilensteinen bestätigt</span>
        </div>
      </div>

      <div className="sp-wp-list">
        <div className="sp-list-label">Arbeitspakete</div>
        {WORKPACKAGES.map(w => {
          const p = progress[w.id] ?? w.progress;
          const mine = w.owner === ME;
          return (
            <button key={w.id} className={"sp-wp" + (mine ? " mine" : "")} onClick={() => onPick(w.id)}>
              <div className="sp-wp-top">
                <Avatar id={w.owner} size={20}/>
                <span className="sp-wp-name">{w.name}</span>
                {mine && <span className="sp-wp-me">Du</span>}
              </div>
              <ProgressBar pct={p} width={null}/>
            </button>
          );
        })}
      </div>

      <div className="sp-note">
        Der Wert beschreibt das Projekt, nicht einzelne Personen. Er wird nicht historisiert
        und nicht für Leistungsbeurteilungen verwendet.
      </div>
    </div>
  );
}

// ─── Eigenes Arbeitspaket, prominent über der Tabelle ────────────
function MyWorkpackage({ progress, onOpen }) {
  const mine = WORKPACKAGES.filter(w => w.owner === ME);
  if (!mine.length) return null;
  return (
    <div className="mywp-strip">
      {mine.map(w => {
        const p    = progress[w.id] ?? w.progress;
        const rest = 100 - p;
        const zone = progressZone(p);
        return (
          <div key={w.id} className={"mywp" + (p >= 75 && p < 100 ? " sprint" : "") + (p === 100 ? " done" : "")}>
            <div className="mywp-left">
              <span className="mywp-tag">Dein Arbeitspaket</span>
              <span className="mywp-name">{w.name}</span>
            </div>
            <div className="mywp-bar">
              <span className="mywp-track">
                <span className="mywp-fill" style={{width:p+"%", background:zone.color}}/>
              </span>
              <span className="mywp-pct" style={{color:zone.color}}>{p}%</span>
            </div>
            <div className="mywp-rest">
              {p === 100
                ? <span className="mywp-ok">✓ abgeschlossen</span>
                : <>noch <b>{rest} %</b>{p >= 75 && <span className="mywp-push"> · Endspurt</span>}</>}
            </div>
            <button className="mywp-btn" onClick={() => onOpen(w.id)}>Fortschritt aktualisieren</button>
          </div>
        );
      })}
    </div>
  );
}

// ═══ Projektmodul ════════════════════════════════════════════════
function ProjektScreen({ gami, onReset }) {
  const initProgress = {};
  WORKPACKAGES.forEach(w => { initProgress[w.id] = w.progress; });

  const [tab, setTab]             = React.useState(0);
  const [progress, setProgress]   = React.useState(initProgress);
  const [confirmed, setConfirmed] = React.useState(new Set(["M10"]));
  const [feed, setFeed]           = React.useState(FEED_SEED);
  const [cards, setCards]         = React.useState(BOARD_CARDS);
  const [sprints, setSprints]     = React.useState(SPRINTS);
  const [editWp, setEditWp]       = React.useState(null);
  const [editMs, setEditMs]       = React.useState(null);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [celeb, setCeleb]         = React.useState(null);
  const [toast, setToast]         = React.useState(null);

  const projPct   = computeProjectProgress(progress);
  const zone      = progressZone(projPct);
  const streak    = computeTeamStreak(sprints);

  const showToast = txt => setToast(txt);

  const addFeed = item => setFeed(f => [{ id:nextId(), ts:"gerade eben", kudos:[], ...item }, ...f]);

  // Kudos im Feed
  const toggleFeedKudos = id => setFeed(f => f.map(it =>
    it.id !== id ? it
      : { ...it, kudos: it.kudos.includes(ME) ? it.kudos.filter(k => k !== ME) : [...it.kudos, ME] }));

  // Kudos auf Board-Kommentare
  const toggleCommentKudos = (cardId, commentId) => setCards(cs => cs.map(c =>
    c.id !== cardId ? c
      : { ...c, comments: c.comments.map(k =>
          k.id !== commentId ? k
            : { ...k, kudos: k.kudos.includes(ME) ? k.kudos.filter(x => x !== ME) : [...k.kudos, ME] }) }));

  // Neuer Kommentar auf dem Board → erscheint im Kudos-Feed
  const addComment = (cardId, text) => {
    const card = cards.find(c => c.id === cardId);
    const cid  = "k" + (++feedSeq);
    setCards(cs => cs.map(c => c.id !== cardId ? c
      : { ...c, comments:[...c.comments, { id:cid, author:ME, ts:"gerade eben", text, kudos:[] }] }));
    addFeed({ author:ME, type:"comment", card:card.title, text });
    if (gami.kudos) showToast("Kommentar veröffentlicht – das Team sieht ihn im Kudos-Feed und kann darauf reagieren.");
  };

  // Karte verschieben
  const moveCard = (cardId, dir) => {
    const card = cards.find(c => c.id === cardId);
    const i    = BOARD_COLUMNS.findIndex(c => c.id === card.col);
    const j    = Math.min(BOARD_COLUMNS.length - 1, Math.max(0, i + dir));
    if (i === j) return;
    const target = BOARD_COLUMNS[j];
    setCards(cs => cs.map(c => c.id === cardId ? { ...c, col: target.id } : c));
    if (target.id === "done") {
      addFeed({ author: card.owner, type:"card", text:"Aufgabe „" + card.title + "\u201c abgeschlossen", card: card.title });
      if (gami.momentum) showToast("„" + card.title + "\u201c ist fertig – der Beitrag steht jetzt im Kudos-Feed.");
    }
  };

  // Fortschritt speichern
  const saveProgress = value => {
    const wpId = editWp;
    const wp   = wpById(wpId);
    const prev = progress[wpId];
    setEditWp(null);
    setProgress(p => ({ ...p, [wpId]: value }));

    if (value === 100 && prev < 100) {
      addFeed({ author: wp.owner, type:"wp", text: wp.name + " auf 100 % abgeschlossen" });
      if (gami.momentum) {
        setCeleb({ emoji:"✅", title:"Arbeitspaket abgeschlossen",
          sub: wp.name + " steht auf 100 %. Meilenstein " + wp.ms + " kann jetzt bestätigt werden.",
          streak: null });
      }
    } else {
      addFeed({ author: wp.owner, type:"wp", text: wp.name + " auf " + value + " % aktualisiert" });
      if (gami.progress) showToast(wp.name + " steht jetzt bei " + value + " % – noch " + (100 - value) + " % bis zum Abschluss.");
    }
  };

  // Meilenstein bestätigen
  const confirmMilestone = () => {
    const ms = editMs;
    setEditMs(null);
    setConfirmed(prev => new Set([...prev, ms.id]));
    addFeed({ author: ME, type:"ms", text:"Meilenstein " + ms.id + " – " + ms.name });
    const all = MILESTONES.every(m => m.id === ms.id || confirmed.has(m.id));
    if (gami.momentum) {
      setCeleb(all
        ? { emoji:"🏁", title:"Projekt abgeschlossen", sub:"Alle sechs Meilensteine sind bestätigt. Das war Teamarbeit.", streak }
        : { emoji: ms.emoji, title:"Meilenstein erreicht", sub:"Das Team hat " + ms.id + " – " + ms.name + " geschafft.", streak });
    } else {
      showToast("Meilenstein " + ms.id + " bestätigt.");
    }
  };

  // Sprint abschließen (Demo)
  const closeSprint = onTime => {
    const last  = sprints[sprints.length - 1];
    const n     = parseInt(last.id.slice(1), 10) + 1;
    const label = "Sprint " + n;
    setSprints(s => [...s.slice(-5), { id:"S"+n, label, onTime }]);
    if (onTime) {
      const next = streak + 1;
      addFeed({ author: ME, type:"sprint", text: label + " im Zeitplan abgeschlossen – " + next + ". Sprint in Folge" });
      if (gami.momentum) setCeleb({ emoji:"🔁", title:"Sprint im Zeitplan", sub:"Das Team hält die Serie.", streak: next });
    } else {
      addFeed({ author: ME, type:"sprint", text: label + " verzögert abgeschlossen – die Serie beginnt neu" });
      showToast("Serie zurückgesetzt. Das hat keine weiteren Folgen – die nächste beginnt mit dem nächsten Sprint.");
    }
  };

  // Meilenstein-Status im Chart
  const msState = ms => {
    if (confirmed.has(ms.id)) return "done";
    return (progress[ms.wp] ?? 0) === 100 ? "ready" : "open";
  };

  const pct = v => (v / NCOL) * 100 + "%";

  return (
    <div className={"klusa-screen gantt-screen" + (panelOpen && tab === 0 ? " with-panel" : "")}>

      {/* Tabs */}
      <div className="ktabs ktabs-green">
        {PROJ_TABS.map((tb, i) => (
          <button key={tb.label} disabled={!tb.on}
            className={"ktab" + (i === tab ? " active" : "") + (!tb.on ? " off" : "")}
            onClick={() => tb.on && setTab(i)}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="ktoolbar">
        <button className="ktool"><Icon name="save"/></button>
        <button className="ktool"><Icon name="refresh"/></button>
        <span className="ksep"/>
        <button className="ktool"><Icon name="chevL"/></button>
        <div className="kselect"><span className="ks-ic"/> {PROJECT.select} <Icon name="caret" size={13}/></div>
        <button className="ktool"><Icon name="chevR"/></button>
        <span className="ksep"/>
        <button className="ktool kt-add"><Icon name="plusC"/></button>
        <button className="ktool kt-edit"><Icon name="pencil"/></button>
        <button className="ktool kt-del"><Icon name="delete"/></button>
        <button className="ktool"><Icon name="funnel"/></button>
        <span className="ksep"/>
        <button className="ktool"><Icon name="zoomIn"/></button>
        <button className="ktool"><Icon name="zoomOut"/></button>
        <button className="ktool"><Icon name="print"/></button>

        <div className="ktool-gami">
          {gami.momentum && <TeamMomentum sprints={sprints} current={CURRENT_SPRINT} compact/>}
          {gami.progress && (
            <>
              <button className={"datapflege-pill" + (panelOpen ? " open" : "")}
                onClick={() => { setPanelOpen(o => !o); setTab(0); }}>
                <span className="dp-label">Projektfortschritt</span>
                <span className="dp-track"><span className="dp-fill" style={{width:projPct+"%", background:zone.color}}/></span>
                <span className="dp-pct" style={{color:zone.color}}>{projPct}%</span>
                <span className="dp-caret">{panelOpen ? "▲" : "▼"}</span>
              </button>
              <InfoDot text="Der Wert ist der Mittelwert aller Arbeitspakete. Er beschreibt das Projekt, nicht einzelne Personen, und fließt in keine Leistungsbeurteilung ein."/>
            </>
          )}
          {onReset && <button className="ktool kt-reset" onClick={onReset} title="Demo zurücksetzen"><Icon name="refresh" size={14}/></button>}
        </div>
      </div>

      {/* Formulare */}
      {editWp && (
        <ProgressForm wp={wpById(editWp)} value={progress[editWp]}
          onClose={() => setEditWp(null)} onSave={saveProgress}/>
      )}
      {editMs && (
        <MilestoneForm ms={editMs} onClose={() => setEditMs(null)} onConfirm={confirmMilestone}/>
      )}

      {/* Inhalt */}
      {tab === 1 ? (
        <BoardScreen cards={cards} gami={gami}
          onMove={moveCard} onComment={addComment} onKudos={toggleCommentKudos}/>
      ) : tab === 2 ? (
        <TeamScreen feed={feed} progress={progress} sprints={sprints} gami={gami}
          onKudos={toggleFeedKudos} onCloseSprint={closeSprint}/>
      ) : tab === 3 ? (
        <RisikenScreen/>
      ) : (
        <div className="gantt-content">
          <div className="gantt-main">
            {gami.progress && <MyWorkpackage progress={progress} onOpen={setEditWp}/>}

            <div className="gantt-table">
              <div className="g-head">
                <div className="gc gc-num">#</div>
                <div className="gc gc-p">P…</div>
                <div className="gc gc-name">Name</div>
                {gami.progress && <div className="gc gc-prog">Fortschritt</div>}
                <div className="gc gc-tl">
                  <div className="tl-quarters">
                    <div className="tlq" style={{flex:"0 0 "+(100/NCOL)+"%"}}/>
                    {GANTT_QUARTERS.map(q => (
                      <div key={q.label} className="tlq" style={{flex:"0 0 "+((q.to-q.from+1)*100/NCOL)+"%"}}>{q.label}</div>
                    ))}
                  </div>
                  <div className="tl-months">{GANTT_MONTHS.map(m => <div key={m} className="tlm">{m}</div>)}</div>
                </div>
              </div>

              <div className="g-body">
                {GANTT_ROWS.map(r => {
                  const wp    = r.wpId ? wpById(r.wpId) : null;
                  const p     = wp ? (progress[wp.id] ?? wp.progress) : null;
                  const ms    = r.msId ? msById(r.msId) : null;
                  const state = ms ? msState(ms) : null;
                  const mine  = wp && wp.owner === ME;

                  return (
                    <div key={r.n} className={"g-row" + (r.selected ? " selected" : "") + (mine ? " g-mine" : "")}>
                      <div className="gc gc-num">{r.n}</div>
                      <div className="gc gc-p">{r.p}</div>
                      <div className="gc gc-name">
                        {r.type === "project" && <><Icon name="expand" size={12} className="g-exp"/><span className="g-proj">P</span></>}
                        {r.type === "group"   && <span className="g-wp wp-neutral"/>}
                        {r.type === "wp"      && <span className={"g-wp" + (p === 100 ? " wp-done" : " wp-open")}/>}
                        {r.type === "ms"      && <span className={"g-ms ms-" + state}/>}
                        <span className="g-name-txt">{r.name}</span>
                        {mine && <span className="g-me">Du</span>}
                      </div>

                      {gami.progress && (
                        <div className="gc gc-prog">
                          {wp ? (
                            <button className="gprog-btn" onClick={() => setEditWp(wp.id)}
                              title={wp.name + " – Fortschritt aktualisieren"}>
                              <ProgressBar pct={p} width={62}/>
                            </button>
                          ) : ms ? (
                            state === "done"  ? <span className="gms-lbl done">bestätigt</span>
                            : state === "ready" ? <button className="gms-claim" onClick={() => setEditMs(ms)}>bestätigen</button>
                            : <span className="gms-lbl">offen</span>
                          ) : null}
                        </div>
                      )}

                      <div className="gc gc-tl"
                        onClick={ms && state === "ready" ? () => setEditMs(ms) : undefined}
                        style={ms && state === "ready" ? {cursor:"pointer"} : undefined}>
                        <div className="tl-grid"/>
                        <div className="tl-today" style={{left:pct(TODAY_COL)}}/>
                        {r.bar?.kind === "summary" && <div className="bar-summary" style={{left:pct(r.bar.start), width:pct(r.bar.span)}}/>}
                        {r.type === "group" && <div className="bar-task bar-plain" style={{left:pct(r.bar.start), width:pct(r.bar.span)}}/>}
                        {r.type === "wp" && (
                          <div className="bar-task" style={{left:pct(r.bar.start), width:pct(r.bar.span)}}>
                            <div className="bar-fill" style={{width:p+"%"}}/>
                            {p > 0 && p < 100 && <span className="bar-pct">{p}%</span>}
                          </div>
                        )}
                        {ms && <div className={"ms-diamond ms-" + state + (state === "ready" ? " ms-claim" : "")} style={{left:pct(ms.at)}}/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {panelOpen && (
            <ProgressPanel progress={progress} confirmed={confirmed}
              onClose={() => setPanelOpen(false)} onPick={setEditWp}/>
          )}
        </div>
      )}

      {toast && <InlineToast text={toast} onDone={() => setToast(null)}/>}
      {celeb && <MomentumOverlay {...celeb} onDone={() => setCeleb(null)}/>}
    </div>
  );
}

Object.assign(window, { ProjektScreen });
