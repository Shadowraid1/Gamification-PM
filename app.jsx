// app.jsx — KLUSA App Shell · Login → Newsfeed → Module

const MODULES = [
  { id:"projekte",    label:"Projekte" },
  { id:"management",  label:"Management",     off:true },
  { id:"ressourcen",  label:"Ressourcen",     off:true },
  { id:"meinklusa",   label:"MeinKLUSA" },
  { id:"unternehmen", label:"Unternehmen" },
  { id:"admin",       label:"Administration", off:true },
];

const GAMI_LABELS = [
  ["progress", "Fortschritt der Arbeitspakete", "Fertigstellungsgrad im GANTT und im Projektpanel"],
  ["kudos",    "Kudos von Kollegen",            "Beiträge und Kommentare sichtbar würdigen"],
  ["momentum", "Team-Momentum",                 "Feiermomente und Sprint-Serie des Teams"],
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent":    ["#3d9b35", "#e8902a"],
  "intensity": "ausgewogen",
  "font":      "Segoe UI"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [loggedIn, setLoggedIn]       = React.useState(false);
  const [userName, setUserName]       = React.useState("Peter");
  const [module, setModule]           = React.useState("unternehmen");
  const [gami, setGami]               = React.useState(GAMI_DEFAULTS);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [avatarImg, setAvatarImg]     = React.useState(null);
  const [resetCount, setResetCount]   = React.useState(0);
  const [zeitOpen, setZeitOpen]       = React.useState(countOpenTimeDays(ZEIT_ROWS));

  const toggleGami = k => setGami(g => ({ ...g, [k]: !g[k] }));

  const pickAvatar = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setAvatarImg(ev.target.result);
    r.readAsDataURL(f);
  };

  const styleVars = {
    "--progress": t.accent[0],
    "--streak":   t.accent[1],
    "--font-ui":  `'${t.font}', 'Segoe UI', Tahoma, Verdana, sans-serif`,
  };

  const reset = () => setResetCount(c => c + 1);

  if (!loggedIn) return <LoginScreen onLogin={n => { setUserName(n || "Peter"); setLoggedIn(true); }}/>;

  return (
    <div className={"kapp int-" + (t.intensity || "ausgewogen")} style={styleVars}>

      <header className="kappbar">
        <img className="kbrand" src="assets/klusa-logo.png" alt="KLUSA"/>
        <nav className="kmodules">
          {MODULES.map(m => (
            <button key={m.id} disabled={m.off}
              className={"kmod" + (m.id === module ? " active" : "") + (m.off ? " off" : "")}
              onClick={() => !m.off && setModule(m.id)}>
              {m.label}
              {m.id === "meinklusa" && zeitOpen > 0 && (
                <span className="kmod-badge" title={zeitOpen + " Tag(e) noch zu buchen"}>{zeitOpen}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="kappbar-right">
          <span className="kproj-name">{PROJECT.name} <span className="kproj-code">· {PROJECT.code}</span></span>
          <div className="kavatar-wrap">
            <button className="kavatar" title={userName} onClick={() => setProfileOpen(o => !o)}>
              {avatarImg ? <img src={avatarImg} alt=""/> : userName.slice(0,2).toUpperCase()}
            </button>
            {profileOpen && (
              <div className="kprofile" onClick={e => e.stopPropagation()}>
                <div className="kprofile-head">
                  <div className="kprofile-av">
                    {avatarImg ? <img src={avatarImg} alt=""/> : userName.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="kprofile-name">{userName}</div>
                    <label className="kprofile-upload">
                      Profilbild wählen
                      <input type="file" accept="image/*" onChange={pickAvatar} hidden/>
                    </label>
                  </div>
                  <button className="kprofile-x" onClick={() => setProfileOpen(false)}>✕</button>
                </div>

                <div className="kprofile-sec">Gamification-Elemente</div>
                {GAMI_LABELS.map(([k, lbl, sub]) => (
                  <label key={k} className="kprofile-opt">
                    <input type="checkbox" checked={gami[k]} onChange={() => toggleGami(k)}/>
                    <span>
                      <span className="kpo-lbl">{lbl}</span>
                      <span className="kpo-sub">{sub}</span>
                    </span>
                  </label>
                ))}
                <div className="kprofile-note">
                  Abgeschaltete Elemente werden weder angezeigt noch im Hintergrund erfasst.
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="kcontent">
        {module === "projekte"
          ? <ProjektScreen key={resetCount} gami={gami} onReset={reset}/>
          : module === "meinklusa"
          ? <ZeitScreen onOpenDaysChange={setZeitOpen}/>
          : module === "unternehmen"
          ? <UnternehmenScreen userName={userName}/>
          : null}
      </main>

      <TweaksPanel>
        <TweakSection label="Gamification"/>
        <TweakRadio label="Sichtbarkeit" value={t.intensity}
          options={["dezent","ausgewogen","lebendig"]}
          onChange={v => setTweak("intensity", v)}/>
        <TweakColor label="Farben" value={t.accent}
          options={[["#3d9b35","#e8902a"],["#2e9e8f","#e0a52e"],["#3a78c2","#e8902a"],["#9e1b52","#e8902a"]]}
          onChange={v => setTweak("accent", v)}/>
        <TweakSection label="Darstellung"/>
        <TweakSelect label="Schriftart" value={t.font}
          options={["Segoe UI","Tahoma","Verdana","Arial"]}
          onChange={v => setTweak("font", v)}/>
        <TweakSection label="Demo"/>
        <TweakButton label="Projektdaten zurücksetzen" onClick={reset}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
