# KLUSA Gamification-Prototyp v4

Klick-Prototyp für Gamification in einer B2B-Projektmanagement-Software.
Login-Passwort: `klusa`

## Die drei Mechaniken

### 1. Fortschritt der Arbeitspakete
- Eigene Arbeitspakete stehen als Leiste über dem GANTT (`WP3 – Testing`, Start bei 53 %).
- Die Restanzeige („noch 47 %") nutzt den Goal-Gradient-Effekt; ab 75 % erscheint ein Endspurt-Hinweis.
- Eigene Spalte im GANTT plus Füllstand direkt in den Balken.
- Klick auf einen Balken öffnet einen Slider mit 0/25/50/75/100-Schnellwahl.
- Der Projektfortschritt in der Toolbar ist der Mittelwert aller sechs Arbeitspakete.
- Ein Meilenstein wird erst bestätigbar, wenn sein Arbeitspaket 100 % erreicht.

### 2. Kudos von Kollegen
- Reiter **Aufgabenboard**: Kanban mit vier Spalten, Karten mit Kommentaren.
- Jeder Kommentar kann von Kollegen mit 👏 gewürdigt werden.
- Reiter **Team & Kudos**: Feed aller Beiträge — abgeschlossene Arbeitspakete, bestätigte
  Meilensteine, erledigte Karten und Kommentare. Alles ist würdigungsfähig.
- Eigene Beiträge lassen sich nicht selbst würdigen.
- Kudos werden bewusst nicht sortiert und nicht als Rangliste geführt.

### 3. Team-Momentum
- Sprint-Serie („5 Sprints in Folge im Zeitplan") in Toolbar und Team-Reiter — auf Team-,
  nicht auf Personenebene.
- Feiermomente bei abgeschlossenem Arbeitspaket, bestätigtem Meilenstein und Sprintende.
- Über die Demo-Buttons im Team-Reiter lässt sich ein Sprint pünktlich oder verzögert
  abschließen, um Aufbau und Bruch der Serie zu zeigen.

## Entfernt gegenüber v3
XP und Level, Meilenstein- und Qualitäts-Badges, Zeiterfassungs-Streak-Badges,
Peer-Badge-Vergabe, individueller Pflege-Streak, WP-Status-Streak pro Person,
Datenpflege-Score auf den Risiken.

Zeiterfassung und Risiken sind jetzt bewusst nicht gamifiziert — tägliche Serien auf
Einzelpersonen erzeugen Druck, und Risikobewertung sollte eine fachliche Einschätzung
bleiben.

## Struktur
```
index.html
styles.css
src/data.jsx          Datenmodell
src/components.jsx    Icons, Avatare, Fortschritt, Kudos, Momentum
src/gantt.jsx         Projektmodul: Tabs, gemeinsamer State, GANTT
src/board.jsx         Kanban-Aufgabenboard
src/team.jsx          Kudos-Feed + Team-Momentum
src/risiken.jsx       Risiken (nicht gamifiziert)
src/zeit.jsx          Zeiterfassung (nicht gamifiziert)
src/unternehmen.jsx   Newsfeed
src/login.jsx         Anmeldung
src/app.jsx           App-Shell, Opt-out im Profilmenü
```

Über das Profilmenü oben rechts lässt sich jede der drei Mechaniken einzeln abschalten.
