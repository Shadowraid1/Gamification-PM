// data.jsx — Datenmodell des Prototyps
// Gamification-Bausteine: (1) Arbeitspaket-Fortschritt, (2) Kudos, (3) Team-Momentum.

const PROJECT = { name:"HZE_Master_01", code:"14020002", select:"[1] Keinem AP zugewiesen" };

// Angemeldeter Nutzer im Prototyp
const ME = "peter";

// ─── Team ────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  { id:"peter", name:"Peter K.", short:"Peter", role:"Projektleiter", avatar:"PK", color:"#9e1b52" },
  { id:"maria", name:"Maria S.", short:"Maria", role:"Requirements",  avatar:"MS", color:"#3a78c2" },
  { id:"tom",   name:"Tom H.",   short:"Tom",   role:"Testing",       avatar:"TH", color:"#2e9e8f" },
  { id:"anna",  name:"Anna B.",  short:"Anna",  role:"Pilot",         avatar:"AB", color:"#c2733a" },
  { id:"max",   name:"Max R.",   short:"Max",   role:"Training",      avatar:"MR", color:"#6f5bb8" },
];
const memberById = id => TEAM_MEMBERS.find(m => m.id === id) || TEAM_MEMBERS[0];

// ─── Arbeitspakete (Fortschritt = Kernmechanik 1) ────────────────
// WP3 steht bewusst bei 53 %: der Nutzer sieht seinen eigenen Teilfortschritt
// und den verbleibenden Rest (Goal-Gradient-Effekt).
const WORKPACKAGES = [
  { id:"WP1", name:"WP1 – Initiation",    owner:"maria", progress:100, ms:"M10" },
  { id:"WP2", name:"WP2 – Requirements",  owner:"maria", progress:100, ms:"M20" },
  { id:"WP3", name:"WP3 – Testing",       owner:"peter", progress:53,  ms:"M30" },
  { id:"WP4", name:"WP4 – Pilot",         owner:"anna",  progress:20,  ms:"M40" },
  { id:"WP5", name:"WP5 – Training",      owner:"max",   progress:0,   ms:"M50" },
  { id:"WP6", name:"WP6 – Rollout",       owner:"tom",   progress:0,   ms:"M60" },
];
const wpById = id => WORKPACKAGES.find(w => w.id === id);

// ─── Meilensteine ────────────────────────────────────────────────
// Ein Meilenstein wird erst bestätigbar, wenn sein Arbeitspaket 100 % erreicht.
const MILESTONES = [
  { id:"M10", name:"Initiation abgeschlossen",     rowN:4,  at:0.5, wp:"WP1", emoji:"🚀" },
  { id:"M20", name:"Implementation abgeschlossen", rowN:6,  at:1.2, wp:"WP2", emoji:"⚙️" },
  { id:"M30", name:"Testing abgeschlossen",        rowN:8,  at:3.8, wp:"WP3", emoji:"🧪" },
  { id:"M40", name:"Pilot abgeschlossen",          rowN:10, at:5.0, wp:"WP4", emoji:"✈️" },
  { id:"M50", name:"Training abgeschlossen",       rowN:12, at:6.9, wp:"WP5", emoji:"🎓" },
  { id:"M60", name:"Projekt abgeschlossen",        rowN:14, at:8.4, wp:"WP6", emoji:"🏁" },
];
const msById = id => MILESTONES.find(m => m.id === id);

// ─── GANTT-Struktur ──────────────────────────────────────────────
const GANTT_ROWS = [
  { n:1,  p:"",   name:"HZE_Master_01",             type:"project", bar:{start:0,   span:8.4, kind:"summary"} },
  { n:2,  p:"1",  name:"Keinem AP zugewiesen",      type:"group",   selected:true, bar:{start:0, span:8.2, kind:"task"} },
  { n:3,  p:"2",  name:"WP1 – Initiation",          type:"wp", wpId:"WP1", bar:{start:0,   span:0.5} },
  { n:4,  p:"3",  name:"M10 – Initiation finished", type:"ms", msId:"M10", at:0.5 },
  { n:5,  p:"4",  name:"WP2 – Requirements",        type:"wp", wpId:"WP2", bar:{start:0.55,span:0.6} },
  { n:6,  p:"5",  name:"M20 – Implementation fin…", type:"ms", msId:"M20", at:1.2 },
  { n:7,  p:"6",  name:"WP3 – Testing",             type:"wp", wpId:"WP3", bar:{start:1.3, span:2.4} },
  { n:8,  p:"7",  name:"M30 – Testing Finished",    type:"ms", msId:"M30", at:3.8 },
  { n:9,  p:"8",  name:"WP4 – Pilot",               type:"wp", wpId:"WP4", bar:{start:4.0, span:0.9} },
  { n:10, p:"9",  name:"M40 – Pilot Finished",      type:"ms", msId:"M40", at:5.0 },
  { n:11, p:"10", name:"WP5 – Training",            type:"wp", wpId:"WP5", bar:{start:5.1, span:1.7} },
  { n:12, p:"11", name:"M50 – Training Finished",   type:"ms", msId:"M50", at:6.9 },
  { n:13, p:"12", name:"WP6 – Rollout",             type:"wp", wpId:"WP6", bar:{start:7.0, span:1.3} },
  { n:14, p:"13", name:"M60 – Project Closed",      type:"ms", msId:"M60", at:8.4 },
];
const GANTT_MONTHS   = ["Dez 21","Jan 22","Feb 22","Mrz 22","Apr 22","Mai 22","Jun 22","Jul 22","Aug 22"];
const GANTT_QUARTERS = [{label:"Q1 2022",from:1,to:3},{label:"Q2 2022",from:4,to:6},{label:"Q3 2022",from:7,to:8}];
const TODAY_COL = 3.0;

// ─── Terminplan je Arbeitspaket (aus dem GANTT abgeleitet) ───────
// Eine GANTT-Spalte = ein Monat ≈ 21 Arbeitstage. Daraus ergibt sich für
// jedes Arbeitspaket: Gesamtdauer, verstrichene Tage und der Soll-Fortschritt.
const DAYS_PER_COL = 21;
const WP_SCHEDULE = {};
GANTT_ROWS.forEach(r => { if (r.type === "wp" && r.bar) WP_SCHEDULE[r.wpId] = { start:r.bar.start, span:r.bar.span }; });

function wpPlan(wpId) {
  const s = WP_SCHEDULE[wpId];
  if (!s) return null;
  const totalDays   = Math.max(1, Math.round(s.span * DAYS_PER_COL));
  const elapsedDays = Math.min(totalDays, Math.max(0, Math.round((TODAY_COL - s.start) * DAYS_PER_COL)));
  return {
    totalDays, elapsedDays,
    planned: Math.round(elapsedDays / totalDays * 100),  // Soll-Fortschritt = verstrichene Zeit
    started: TODAY_COL > s.start,
    over:    TODAY_COL > s.start + s.span,
  };
}

// ─── Ampel-Schwellen: pro Arbeitspaket einstellbar ───────────────
// Gemessen wird der Abstand zwischen Ist und Soll in Prozentpunkten.
// Beispiel: 5 von 10 Tagen verstrichen (Soll 50 %), erst 10 % erledigt
// → Rückstand 40 Punkte → rot, sobald crit ≤ 40.
const WP_THRESHOLD_DEFAULTS = { warn:10, crit:25 };
const WP_THRESHOLDS = {
  WP1:{ warn:10, crit:25 },
  WP2:{ warn:10, crit:25 },
  WP3:{ warn:8,  crit:20 },   // kritischer Pfad → engere Schwellen
  WP4:{ warn:15, crit:30 },   // Pilot mit Puffer → großzügiger
  WP5:{ warn:10, crit:25 },
  WP6:{ warn:10, crit:25 },
};

const STATUS_META = {
  done:    { label:"abgeschlossen",           short:"fertig",     color:"var(--progress)" },
  ahead:   { label:"vor Plan",                short:"vor Plan",   color:"var(--progress)" },
  ontrack: { label:"im Plan",                 short:"im Plan",    color:"var(--progress)" },
  warn:    { label:"hinter Plan",             short:"Rückstand",  color:"var(--warn)"     },
  crit:    { label:"deutlich hinter Plan",    short:"kritisch",   color:"var(--danger)"   },
  planned: { label:"noch nicht begonnen",     short:"geplant",    color:"var(--neutral)"  },
};

// Status eines Arbeitspakets: Ist gegen Soll, bewertet mit den WP-eigenen Schwellen.
function wpStatus(wpId, actual, thresholds) {
  const th   = (thresholds && thresholds[wpId]) || WP_THRESHOLDS[wpId] || WP_THRESHOLD_DEFAULTS;
  const plan = wpPlan(wpId);
  const mk   = (key, delta) => ({ key, ...STATUS_META[key], th, plan,
                                  planned: plan ? plan.planned : 0, delta });
  if (actual >= 100)          return mk("done",    plan ? 100 - plan.planned : 0);
  if (!plan || !plan.started) return mk("planned", actual);
  const delta = actual - plan.planned;            // negativ = Rückstand
  if (delta >= 0)             return mk("ahead",   delta);
  if (-delta <= th.warn)      return mk("ontrack", delta);
  if (-delta <= th.crit)      return mk("warn",    delta);
  return                             mk("crit",    delta);
}

// Klartext für Tooltip und Formular – bewusst ohne Fachbegriffe
function wpStatusText(st) {
  if (!st.plan) return st.label;
  if (st.key === "planned") return "Start noch nicht erreicht";
  const zeit = "Tag " + st.plan.elapsedDays + " von " + st.plan.totalDays + " Arbeitstagen";
  if (st.key === "done") return "Abgeschlossen · " + zeit;
  return "Soll heute " + st.planned + " % · " + zeit +
         (st.delta < 0 ? " · " + (-st.delta) + " % im Rückstand"
                       : " · " + st.delta + " % vor dem Plan");
}

// ─── Team-Momentum: Sprints im Zeitplan (Kernmechanik 3) ─────────
// Die Serie zählt auf Teamebene, nicht pro Person.
const SPRINTS = [
  { id:"S11", label:"Sprint 11", onTime:false },
  { id:"S12", label:"Sprint 12", onTime:true  },
  { id:"S13", label:"Sprint 13", onTime:true  },
  { id:"S14", label:"Sprint 14", onTime:true  },
  { id:"S15", label:"Sprint 15", onTime:true  },
  { id:"S16", label:"Sprint 16", onTime:true  },
];
const CURRENT_SPRINT = { id:"S17", label:"Sprint 17", daysLeft:4 };

// Länge der aktuellen Serie am Ende der Liste
function computeTeamStreak(sprints) {
  let n = 0;
  for (let i = sprints.length - 1; i >= 0; i--) {
    if (sprints[i].onTime) n++; else break;
  }
  return n;
}
const BEST_STREAK = 6;

// ─── Kudos-Feed (Kernmechanik 2) ─────────────────────────────────
// type: wp | ms | comment | sprint
const FEED_SEED = [
  { id:"f1", author:"anna",  type:"wp",      ts:"vor 2 Std.",
    text:"WP4 – Pilot auf 20 % aktualisiert", kudos:["maria"] },
  { id:"f2", author:"maria", type:"wp",      ts:"Gestern",
    text:"WP2 – Requirements auf 100 % abgeschlossen", kudos:["peter","tom","anna"] },
  { id:"f3", author:"tom",   type:"comment", ts:"Gestern", card:"Regressionstests aufsetzen",
    text:"Der Testdatensatz aus Sprint 15 lässt sich wiederverwenden – spart uns rund zwei Tage.",
    kudos:["maria"] },
  { id:"f4", author:"max",   type:"comment", ts:"vor 2 Tagen", card:"Trainingskonzept abstimmen",
    text:"Schulungsunterlagen liegen jetzt im Doku-Ordner. Feedback gerne direkt am Kanban-Board.",
    kudos:[] },
  { id:"f5", author:"peter", type:"sprint",  ts:"vor 3 Tagen",
    text:"Sprint 16 im Zeitplan abgeschlossen – fünfter Sprint in Folge",
    kudos:["maria","tom","anna","max"] },
];

// ─── Kanban-Board ────────────────────────────────────────────────
const BOARD_COLUMNS = [
  { id:"backlog", label:"Backlog"   },
  { id:"doing",   label:"In Arbeit" },
  { id:"review",  label:"Review"    },
  { id:"done",    label:"Fertig"    },
];

const BOARD_CARDS = [
  { id:"c1", col:"doing",   wp:"WP3", owner:"peter", title:"Regressionstests aufsetzen",
    comments:[
      { id:"k1", author:"tom",   ts:"Gestern",     text:"Der Testdatensatz aus Sprint 15 lässt sich wiederverwenden – spart uns rund zwei Tage.", kudos:["maria"] },
      { id:"k2", author:"peter", ts:"vor 4 Std.",  text:"Gute Idee, ich hänge das Set an das Ticket an.", kudos:[] },
    ]},
  { id:"c2", col:"doing",   wp:"WP3", owner:"tom",   title:"Testprotokoll Modul B",
    comments:[
      { id:"k3", author:"tom", ts:"vor 1 Tag", text:"Zwei Abweichungen gefunden, beide unkritisch. Details im Protokoll.", kudos:["peter"] },
    ]},
  { id:"c3", col:"review",  wp:"WP4", owner:"anna",  title:"Pilotkunden-Onboarding",
    comments:[
      { id:"k4", author:"anna", ts:"vor 3 Std.", text:"Onboarding-Leitfaden steht. Wer gegenlesen mag: Version 0.9 im Ordner.", kudos:[] },
    ]},
  { id:"c4", col:"backlog", wp:"WP5", owner:"max",   title:"Trainingskonzept abstimmen",
    comments:[
      { id:"k5", author:"max", ts:"vor 2 Tagen", text:"Schulungsunterlagen liegen jetzt im Doku-Ordner. Feedback gerne direkt hier.", kudos:["anna"] },
    ]},
  { id:"c5", col:"backlog", wp:"WP6", owner:"tom",   title:"Rollout-Checkliste entwerfen", comments:[] },
  { id:"c6", col:"backlog", wp:"WP4", owner:"anna",  title:"Feedbackbogen Pilot",          comments:[] },
  { id:"c7", col:"done",    wp:"WP2", owner:"maria", title:"Anforderungen freigeben",
    comments:[
      { id:"k6", author:"maria", ts:"Gestern", text:"Freigabe vom Fachbereich liegt vor, WP2 ist damit durch.", kudos:["peter","anna"] },
    ]},
  { id:"c8", col:"done",    wp:"WP1", owner:"maria", title:"Projektsteckbrief erstellen",  comments:[] },
];

// ─── Fortschrittsberechnung ──────────────────────────────────────
// Zwei nachvollziehbare Definitionen, im Panel umschaltbar:
//   gleich = ungewichteter Mittelwert aller Arbeitspakete
//   dauer  = gewichtet mit der geplanten Dauer (ein langes AP zählt mehr)
function computeProjectProgress(progressMap, mode = "gleich") {
  if (!WORKPACKAGES.length) return 0;
  let sum = 0, wsum = 0;
  WORKPACKAGES.forEach(w => {
    const v = progressMap[w.id] ?? w.progress;
    const weight = mode === "dauer" ? (WP_SCHEDULE[w.id] ? WP_SCHEDULE[w.id].span : 1) : 1;
    sum += v * weight; wsum += weight;
  });
  return Math.round(sum / wsum);
}

// Soll-Fortschritt des Projekts zum heutigen Tag – Referenz für die Ampel.
function computePlannedProjectProgress(mode = "gleich") {
  let sum = 0, wsum = 0;
  WORKPACKAGES.forEach(w => {
    const plan = wpPlan(w.id);
    const weight = mode === "dauer" ? (WP_SCHEDULE[w.id] ? WP_SCHEDULE[w.id].span : 1) : 1;
    sum += (plan ? plan.planned : 0) * weight; wsum += weight;
  });
  return Math.round(sum / wsum);
}

// Farbe des Projektbalkens: ebenfalls Ist gegen Soll, nicht gegen absolute Prozentmarken.
function projectZone(pct, planned, th = WP_THRESHOLD_DEFAULTS) {
  if (pct >= 100)              return { key:"done",    ...STATUS_META.done    };
  const delta = pct - planned;
  if (delta >= 0)              return { key:"ahead",   ...STATUS_META.ahead,   delta };
  if (-delta <= th.warn)       return { key:"ontrack", ...STATUS_META.ontrack, delta };
  if (-delta <= th.crit)       return { key:"warn",    ...STATUS_META.warn,    delta };
  return                              { key:"crit",    ...STATUS_META.crit,    delta };
}

// Rückwärtskompatibel: wird nur noch dort benutzt, wo kein Terminbezug existiert.
function progressZone(pct) {
  if (pct >= 100) return { label:"abgeschlossen", color:"var(--progress)" };
  if (pct === 0)  return { label:"nicht begonnen", color:"var(--neutral)" };
  return { label:"in Arbeit", color:"var(--progress-light)" };
}

// ─── Risiken (nicht gamifiziert, normale Projektdaten) ───────────
const RISK_ROWS = [
  { id:"R-01", name:"Lieferverzug Fremdkomponente",         severity:"hoch",
    probability:"hoch",   impact:"kritisch", measure:"Zweitlieferant qualifizieren",     owner:"Peter K." },
  { id:"R-02", name:"Schlüsselressource fällt aus",         severity:"mittel",
    probability:"mittel", impact:"spürbar",  measure:"Vertretungsregelung dokumentieren", owner:"Maria S." },
  { id:"R-03", name:"Anforderungsänderung durch Kunden",    severity:"mittel",
    probability:"mittel", impact:"spürbar",  measure:"Change-Request-Prozess",            owner:"Maria S." },
  { id:"R-04", name:"Testumgebung nicht rechtzeitig frei",  severity:"niedrig",
    probability:"niedrig",impact:"gering",   measure:"Cloud-Umgebung als Rückfallebene",  owner:"Tom H."   },
  { id:"R-05", name:"Budgetüberschreitung Schulungen",      severity:"mittel",
    probability:"mittel", impact:"spürbar",  measure:"Angebote von drei Anbietern",       owner:"Max R."   },
];

// ─── Zeiterfassung (nicht gamifiziert) ───────────────────────────
const ZEIT_ROWS = [
  { sum:true,  erf:"74:30", diff:"-93:30", diffNeg:true, pt:"9,31", ges:"74:30", ziel:"168:00" },
  { datum:"So 01.05", grund:"Feiertag", holiday:true },
  { datum:"Mo 02.05", erf:"8:45", diff:"0:45",  pt:"1,09", ges:"8:45", ziel:"8:00" },
  { datum:"Di 03.05", erf:"7:30", diff:"-0:30", diffNeg:true, pt:"0,94", ges:"7:30", ziel:"8:00" },
  { datum:"Mi 04.05", erf:"8:15", diff:"0:15",  pt:"1,03", ges:"8:15", ziel:"8:00" },
  { datum:"Do 05.05", erf:"9:00", diff:"1:00",  pt:"1,13", ges:"9:00", ziel:"8:00" },
  { datum:"Fr 06.05", erf:"6:00", diff:"-2:00", diffNeg:true, pt:"0,75", ges:"6:00", ziel:"8:00", needsAttention:true },
  { datum:"Sa 07.05", grund:"Nicht-Arbeitszeit", off:true },
  { datum:"So 08.05", grund:"Nicht-Arbeitszeit", off:true },
  { datum:"Mo 09.05", datumRed:true, ziel:"8:00", pending:true },
  { datum:"Di 10.05", erf:"9:00", diff:"1:00",  pt:"1,13", ges:"9:00", ziel:"8:00" },
];

// ─── Zeiterfassungs-Erinnerung (zustandsabhängig, nicht erzwungen) ───
// Persönliche Einstellung: jeder wählt Zeitpunkt und Art selbst. Kein festes
// Pop-up für alle, keine Uhrzeit, die auch bei Urlaub oder erledigter Buchung feuert.
const REMINDER_DEFAULTS = { enabled:true, time:"16:30", mode:"leise" }; // mode: 'leise' | 'aktiv'

// Perioden-Stichtag (Payroll/Controlling). Die Eskalation hängt hieran –
// nicht an einer Tagesuhrzeit. Das eigentliche Ziel ist eine vollständige Periode.
const PERIOD_DEADLINE = { label:"Freigabe an Controlling" };

// Zählt nur echte Lücken: buchungspflichtige Tage ohne Eintrag.
// Urlaub, Feiertag, Wochenende und bereits gebuchte Tage zählen nicht mit.
function countOpenTimeDays(rows) {
  return rows.filter(r => !r.sum && !r.off && !r.holiday && r.pending).length;
}

// Eskalationsstufe abhängig von Tagen bis zum Stichtag.
function reminderLevel(daysToDeadline) {
  if (daysToDeadline <= 0) return "faellig"; // Stichtag erreicht/überschritten → aktive Kanäle
  if (daysToDeadline <= 3) return "bald";    // Stichtag naht → deutlicherer Hinweis
  return "offen";                            // früh → nur stiller Indikator
}

// ─── Monatsraster der Zeiterfassung ──────────────────────────────
// 20 buchungspflichtige Arbeitstage im Mai 2022. Feiertag (26.05.) und
// Betriebsurlaub (27.05.) sind bewusst keine Kästchen: Abwesenheit darf den
// Monat nicht „unvollständig“ machen.
const MONTH_PERIOD = {
  label:"Mai 2022",
  excluded:[ {d:26, reason:"Christi Himmelfahrt"}, {d:27, reason:"Betriebsurlaub"} ],
};
const MONTH_WORKDAYS = [
  { d:2,  wd:"Mo" }, { d:3,  wd:"Di" }, { d:4,  wd:"Mi" }, { d:5,  wd:"Do" }, { d:6,  wd:"Fr" },
  { d:9,  wd:"Mo" }, { d:10, wd:"Di" }, { d:11, wd:"Mi" }, { d:12, wd:"Do" }, { d:13, wd:"Fr" },
  { d:16, wd:"Mo" }, { d:17, wd:"Di" }, { d:18, wd:"Mi" }, { d:19, wd:"Do" }, { d:20, wd:"Fr" },
  { d:23, wd:"Mo" }, { d:24, wd:"Di" }, { d:25, wd:"Mi" }, { d:30, wd:"Mo" }, { d:31, wd:"Di" },
];
// Demo-Lücken: an diesen Tagen wurde nichts gebucht (09.05. entspricht der Tabellenzeile).
const MONTH_GAPS = [9];
const LAST_WORKDAY = MONTH_WORKDAYS[MONTH_WORKDAYS.length - 1].d;

// Gebuchte Tage zum jeweiligen Demo-Zeitpunkt: alles bis heute außer den Lücken,
// plus was im Prototyp nachgebucht wurde.
function bookedDays(today, extra = []) {
  return MONTH_WORKDAYS
    .filter(w => w.d <= today && (!MONTH_GAPS.includes(w.d) || extra.includes(w.d)))
    .map(w => w.d);
}

// Heutiger Tag der Periode (entspricht der offenen Zeile in der Tabelle)
const TODAY_OF_MONTH = 9;

const dayState = (d, today, booked) =>
  booked.includes(d) ? "booked" : d > today ? "future" : "open";

// Offene Tage = fällige Arbeitstage ohne Buchung (nie Zukunft, nie Abwesenheit).
const countOpenMonthDays = (today, booked) =>
  MONTH_WORKDAYS.filter(w => dayState(w.d, today, booked) === "open").length;

const remainingWorkdays = today => MONTH_WORKDAYS.filter(w => w.d > today).length;

// Kurz vor Monatsende: die letzten fünf Arbeitstage
const isMonthEndPhase = today => today <= LAST_WORKDAY && remainingWorkdays(today) <= 5;
const isPeriodClosed  = today => today > LAST_WORKDAY;

// ─── Monatsabzeichen: ein Abzeichen je lückenlos erfasstem Monat ─
// Motiv nach Jahreszeit. Es geht um Vollständigkeit, nicht um Tempo –
// und es wird nicht mit anderen verglichen.
const BADGE_YEAR = 2022;
const MONTH_BADGES = [
  { m:1,  name:"Januar",    short:"Jan", emoji:"❄️", season:"Winter",   color:"#6c8ebf" },
  { m:2,  name:"Februar",   short:"Feb", emoji:"🌨️", season:"Winter",   color:"#6c8ebf" },
  { m:3,  name:"März",      short:"Mrz", emoji:"🌱", season:"Frühling", color:"#5aa84f" },
  { m:4,  name:"April",     short:"Apr", emoji:"🌷", season:"Frühling", color:"#5aa84f" },
  { m:5,  name:"Mai",       short:"Mai", emoji:"🌸", season:"Frühling", color:"#5aa84f" },
  { m:6,  name:"Juni",      short:"Jun", emoji:"☀️", season:"Sommer",   color:"#e8a31f" },
  { m:7,  name:"Juli",      short:"Jul", emoji:"🌻", season:"Sommer",   color:"#e8a31f" },
  { m:8,  name:"August",    short:"Aug", emoji:"🏖️", season:"Sommer",   color:"#e8a31f" },
  { m:9,  name:"September", short:"Sep", emoji:"🍇", season:"Herbst",   color:"#c2733a" },
  { m:10, name:"Oktober",   short:"Okt", emoji:"🍂", season:"Herbst",   color:"#c2733a" },
  { m:11, name:"November",  short:"Nov", emoji:"🌰", season:"Herbst",   color:"#c2733a" },
  { m:12, name:"Dezember",  short:"Dez", emoji:"🎄", season:"Winter",   color:"#6c8ebf" },
];
const CURRENT_MONTH  = 5;                 // Mai läuft
const EARNED_MONTHS  = [1, 2, 3, 4];      // lückenlos erfasst
const badgeByMonth   = m => MONTH_BADGES.find(b => b.m === m);

// Das Abzeichen erscheint am ersten Arbeitstag des Folgemonats.
function badgeState(m) {
  if (EARNED_MONTHS.includes(m)) return "earned";
  if (m === CURRENT_MONTH)       return "running";
  return m < CURRENT_MONTH ? "missed" : "future";
}

// ─── Gamification-Einstellungen (Opt-out) ────────────────────────
const GAMI_DEFAULTS = { progress:true, kudos:true, momentum:true };

Object.assign(window, {
  PROJECT, ME, TEAM_MEMBERS, memberById,
  WORKPACKAGES, wpById, MILESTONES, msById,
  GANTT_ROWS, GANTT_MONTHS, GANTT_QUARTERS, TODAY_COL,
  SPRINTS, CURRENT_SPRINT, computeTeamStreak, BEST_STREAK,
  FEED_SEED, BOARD_COLUMNS, BOARD_CARDS,
  computeProjectProgress, computePlannedProjectProgress, projectZone, progressZone,
  WP_SCHEDULE, DAYS_PER_COL, wpPlan, WP_THRESHOLDS, WP_THRESHOLD_DEFAULTS,
  STATUS_META, wpStatus, wpStatusText,
  MONTH_PERIOD, MONTH_WORKDAYS, MONTH_GAPS, TODAY_OF_MONTH, LAST_WORKDAY, bookedDays,
  BADGE_YEAR, MONTH_BADGES, CURRENT_MONTH, EARNED_MONTHS, badgeByMonth, badgeState,
  dayState, countOpenMonthDays, remainingWorkdays, isMonthEndPhase, isPeriodClosed,
  RISK_ROWS, ZEIT_ROWS, GAMI_DEFAULTS,
  REMINDER_DEFAULTS, PERIOD_DEADLINE, countOpenTimeDays, reminderLevel,
});
