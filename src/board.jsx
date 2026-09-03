// board.jsx — Kanban-Aufgabenboard
// Beiträge + Kommentare nur für team sichtbar.

function CardDetail({ card, gami, onClose, onComment, onKudos }) {
  const [text, setText] = React.useState("");
  const send = () => {
    const t = text.trim();
    if (!t) return;
    onComment(card.id, t);
    setText("");
  };
  const col = BOARD_COLUMNS.find(c => c.id === card.col);

  return (
    <div className="cd-overlay" onClick={onClose}>
      <div className="cd-card" onClick={e => e.stopPropagation()}>
        <div className="cd-head">
          <div>
            <div className="cd-title">{card.title}</div>
            <div className="cd-meta">
              <span className="cd-chip">{card.wp}</span>
              <span className="cd-chip cd-chip-col">{col.label}</span>
              <Avatar id={card.owner} size={20}/>
              <span className="cd-owner">{memberById(card.owner).name}</span>
            </div>
          </div>
          <button className="zef-close" onClick={onClose}>✕</button>
        </div>

        <div className="cd-body">
          <div className="cd-sec">
            Kommentare <span className="cd-count">{card.comments.length}</span>
          </div>

          {card.comments.length === 0 && (
            <div className="cd-empty">Noch keine Kommentare. Der erste Beitrag ist für das ganze Team sichtbar.</div>
          )}

          {card.comments.map(k => (
            <div key={k.id} className={"cd-comment" + (k.author === ME ? " own" : "")}>
              <Avatar id={k.author} size={28}/>
              <div className="cd-c-body">
                <div className="cd-c-head">
                  <b>{memberById(k.author).name}</b>
                  <span className="cd-c-ts">{k.ts}</span>
                </div>
                <div className="cd-c-text">{k.text}</div>
                {gami.kudos && (
                  <div className="cd-c-foot">
                    <KudosButton kudos={k.kudos} own={k.author === ME} compact
                      onToggle={() => onKudos(card.id, k.id)}/>
                    <KudosFaces kudos={k.kudos}/>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="cd-compose">
            <Avatar id={ME} size={28}/>
            <textarea className="cd-input" rows={2} value={text}
              placeholder="Kommentar schreiben …"
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}/>
            <button className="cd-send" disabled={!text.trim()} onClick={send}>
              <Icon name="send" size={14}/> Senden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardCard({ card, gami, onOpen, onMove }) {
  const i = BOARD_COLUMNS.findIndex(c => c.id === card.col);
  const kudosTotal = card.comments.reduce((a, k) => a + k.kudos.length, 0);
  return (
    <div className="bcard">
      <div className="bcard-main" onClick={() => onOpen(card.id)}>
        <div className="bcard-top">
          <span className="bcard-wp">{card.wp}</span>
          <Avatar id={card.owner} size={22}/>
        </div>
        <div className="bcard-title">{card.title}</div>
        <div className="bcard-foot">
          <span className="bcard-stat"><Icon name="comment" size={12}/> {card.comments.length}</span>
          {gami.kudos && kudosTotal > 0 && <span className="bcard-stat bcard-kudos">👏 {kudosTotal}</span>}
        </div>
      </div>
      <div className="bcard-move">
        <button disabled={i === 0} onClick={() => onMove(card.id, -1)} title="Zurück">◀</button>
        <button disabled={i === BOARD_COLUMNS.length - 1} onClick={() => onMove(card.id, 1)} title="Weiter">▶</button>
      </div>
    </div>
  );
}

function BoardScreen({ cards, gami, onMove, onComment, onKudos }) {
  const [openId, setOpenId] = React.useState(null);
  const open = cards.find(c => c.id === openId);

  return (
    <div className="board-screen">
      <div className="bs-head">
        <div>
          <div className="ts-title">Aufgabenboard · {PROJECT.name}</div>
          <div className="ts-sub">
            {cards.length} Aufgaben · Kommentare sind teamweit sichtbar
            {gami.kudos && <InfoDot text="Kollegen können Beiträge und Kommentare mit Kudos würdigen. Kudos sind keine Punkte: Sie werden nicht summiert, nicht verglichen und nicht ausgewertet."/>}
          </div>
        </div>
      </div>

      <div className="bs-cols">
        {BOARD_COLUMNS.map(col => {
          const list = cards.filter(c => c.col === col.id);
          return (
            <div key={col.id} className={"bs-col bs-col-" + col.id}>
              <div className="bs-col-head">
                {col.label} <span className="bs-col-n">{list.length}</span>
              </div>
              <div className="bs-col-body">
                {list.map(c => (
                  <BoardCard key={c.id} card={c} gami={gami} onOpen={setOpenId} onMove={onMove}/>
                ))}
                {!list.length && <div className="bs-col-empty">–</div>}
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <CardDetail card={open} gami={gami} onClose={() => setOpenId(null)}
          onComment={onComment} onKudos={onKudos}/>
      )}
    </div>
  );
}

Object.assign(window, { BoardScreen });
