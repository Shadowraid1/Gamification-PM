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
function computeProjectProgress(progressMap) {
  const vals = WORKPACKAGES.map(w => progressMap[w.id] ?? w.progress);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function progressZone(pct) {
  if (pct >= 100) return { label:"abgeschlossen", color:"var(--progress)"       };
  if (pct >=  60) return { label:"auf Kurs",      color:"var(--progress-light)" };
  if (pct >=  30) return { label:"in Arbeit",     color:"var(--warn)"           };
  return               { label:"gestartet",     color:"var(--danger)"         };
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

// ─── Gamification-Einstellungen (Opt-out) ────────────────────────
const GAMI_DEFAULTS = { progress:true, kudos:true, momentum:true };

Object.assign(window, {
  PROJECT, ME, TEAM_MEMBERS, memberById,
  WORKPACKAGES, wpById, MILESTONES, msById,
  GANTT_ROWS, GANTT_MONTHS, GANTT_QUARTERS, TODAY_COL,
  SPRINTS, CURRENT_SPRINT, computeTeamStreak, BEST_STREAK,
  FEED_SEED, BOARD_COLUMNS, BOARD_CARDS,
  computeProjectProgress, progressZone,
  RISK_ROWS, ZEIT_ROWS, GAMI_DEFAULTS,
});
