// team.jsx — Kudos-Feed + Team-Momentum
// Kein Ranking, keine Punktestände: Sichtbarkeit von Beiträgen und Anerkennung durch Kollegen.

const FEED_ICON = { wp:"📦", ms:"🚩", comment:"💬", card:"✅", sprint:"🔁" };

function FeedRow({ item, gami, onKudos }) {
  const m   = memberById(item.author);
  const own = item.author === ME;
  return (
    <div className={"feed-row" + (own ? " own" : "")}>
      <Avatar id={item.author} size={32}/>
      <div className="feed-body">
        <div className="feed-head">
          <b>{m.name}</b>
          {own && <span className="feed-me">Du</span>}
          <span className="feed-icon">{FEED_ICON[item.type]}</span>
          <span className="feed-ts">{item.ts}</span>
        </div>

        {item.type === "comment" ? (
          <>
            <div className="feed-ctx">Kommentar zu „{item.card}“</div>
            <div className="feed-quote">{item.text}</div>
          </>
        ) : (
          <div className="feed-text">{item.text}</div>
        )}

        {gami.kudos && (
          <div className="feed-foot">
            <KudosButton kudos={item.kudos} own={own} onToggle={() => onKudos(item.id)}/>
            <KudosFaces kudos={item.kudos}/>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamScreen({ feed, progress, sprints, gami, thresholds, onKudos, onCloseSprint }) {
  const received = {};
  TEAM_MEMBERS.forEach(m => { received[m.id] = 0; });
  feed.forEach(it => { received[it.author] = (received[it.author] || 0) + it.kudos.length; });

  // Nur wer tatsächlich gewürdigt wurde, taucht auf. Eine Liste mit Nullen neben
  // Namen wäre genau die Rangliste, die hier nicht entstehen soll.
  const withKudos = TEAM_MEMBERS.filter(m => received[m.id] > 0);

  return (
    <div className="team-screen">
      <div className="ts-header">
        <div>
          <div className="ts-title">Team & Kudos · {PROJECT.name}</div>
          <div className="ts-sub">
            Beiträge des Teams – Anerkennung ohne Punkte und ohne Rangliste
            <InfoDot text="Der Feed zeigt, woran das Team gerade arbeitet. Kudos sind reine Wertschätzung: Sie werden nicht summiert, nicht verglichen und fließen in keine Beurteilung ein."/>
          </div>
        </div>
      </div>

      {gami.momentum && (
        <div className="ts-momentum">
          <TeamMomentum sprints={sprints} current={CURRENT_SPRINT}/>
          <div className="ts-mom-actions">
            <button className="ts-mom-btn ok"   onClick={() => onCloseSprint(true)}>Sprint im Zeitplan abschließen</button>
            <button className="ts-mom-btn late" onClick={() => onCloseSprint(false)}>Sprint verzögert abschließen</button>
          </div>
        </div>
      )}

      <div className="ts-split">
        <div className="ts-feed">
          <div className="ts-sec">Aktivitäten</div>
          {feed.map(it => <FeedRow key={it.id} item={it} gami={gami} onKudos={onKudos}/>)}
        </div>

        <div className="ts-side">
          <div className="ts-sec">Arbeitspakete im Team</div>
          {WORKPACKAGES.map(w => {
            const p  = progress[w.id] ?? w.progress;
            const st = wpStatus(w.id, p, thresholds);
            return (
              <div key={w.id} className={"tsm-row" + (w.owner === ME ? " mine" : "")}
                title={w.name + " – " + wpStatusText(st)}>
                <Avatar id={w.owner} size={26}/>
                <div className="tsm-info">
                  <div className="tsm-name">{w.name}</div>
                  <ProgressBar pct={p} width={null} zoneColor={st.color} plan={st.planned}/>
                </div>
              </div>
            );
          })}

          {gami.kudos && (
            <>
              <div className="ts-sec" style={{marginTop:16}}>Erhaltene Kudos</div>
              {withKudos.length ? withKudos.map(m => (
                <div key={m.id} className="tsk-row">
                  <Avatar id={m.id} size={24}/>
                  <span className="tsk-name">{m.name}</span>
                  <span className="tsk-count">👏 {received[m.id]}</span>
                </div>
              )) : (
                <div className="tsk-empty">
                  In dieser Periode wurden noch keine Kudos vergeben.
                </div>
              )}
              <div className="ts-note">
                Bewusst unsortiert dargestellt: Kudos sind kein Wettbewerb und werden nicht als
                Rangliste geführt. Wer keine Kudos erhalten hat, erscheint hier gar nicht –
                eine Null neben dem Namen wäre selbst schon eine Wertung.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TeamScreen });
