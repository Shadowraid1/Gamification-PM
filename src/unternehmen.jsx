// unternehmen.jsx — Unternehmens-Newsfeed

const UNT_NEWS = [
  { id:1, date:"09.05.2022", type:"Ankündigung", color:"var(--brand)",
    title:"Q2-Review Termine stehen fest",
    text:"Das PMO hat die Termine für die Q2-Projektreviews bekanntgegeben. Bitte haltet den Fortschritt eurer Arbeitspakete aktuell." },
  { id:2, date:"06.05.2022", type:"Update", color:"var(--gantt-bar)",
    title:"KLUSA 4.0 – Arbeitspaket-Fortschritt, Kudos und Team-Momentum",
    text:"Arbeitspakete zeigen jetzt ihren Fertigstellungsgrad, Beiträge im Aufgabenboard können vom Team mit Kudos gewürdigt werden, und abgeschlossene Sprints im Zeitplan werden als Team-Serie sichtbar. Punkte, Level und persönliche Ranglisten entfallen ersatzlos." },
  { id:3, date:"02.05.2022", type:"Erfolg", color:"var(--progress)",
    title:"Projekt AlphaX erfolgreich abgeschlossen",
    text:"Das Team um Maria Schmidt hat Projekt AlphaX termingerecht und im Budget abgeschlossen. Das PMO gratuliert herzlich!" },
  { id:4, date:"28.04.2022", type:"Info", color:"var(--warn)",
    title:"Pflichtschulung: IT-Sicherheit 2022",
    text:"Die jährliche IT-Sicherheitsschulung ist bis 31.05.2022 zu absolvieren. Anmeldung über das HR-Portal." },
];

function UnternehmenScreen({ userName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  const dateStr = new Date().toLocaleDateString("de-DE", {weekday:"long",day:"2-digit",month:"long",year:"numeric"});

  return (
    <div className="klusa-screen unt-screen">
      <div className="unt-welcome">
        <div className="unt-greeting">{greeting}, <strong>{userName}</strong>!</div>
        <div className="unt-sub">{dateStr} · Neuigkeiten aus dem Unternehmen</div>
      </div>
      <div className="unt-news">
        {UNT_NEWS.map(item => (
          <div key={item.id} className="unt-card">
            <div className="unc-left">
              <span className="unc-type-pill"
                style={{background:`color-mix(in srgb,${item.color} 12%,white)`,color:item.color}}>
                {item.type}
              </span>
              <span className="unc-date">{item.date}</span>
            </div>
            <div className="unc-body">
              <div className="unc-title">{item.title}</div>
              <div className="unc-text">{item.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { UnternehmenScreen });
