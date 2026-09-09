# KLUSA Gamification-Prototyp

Klick-Prototyp zu einer Bachelorarbeit über Gamification in einer
B2B-Projektmanagement-Software. Die Oberfläche bildet KLUSA nach, alle Daten
sind Demodaten.

Anmeldung mit dem Passwort `klusa`.

## Die drei Mechaniken

### 1. Fortschritt der Arbeitspakete

Jedes Arbeitspaket hat einen Fertigstellungsgrad, der im GANTT direkt im Balken
liegt. Der Klick auf einen Balken öffnet ein Formular mit Schnellwahl 0, 25, 50,
75 und 100 Prozent.

Der Fortschritt wird nicht für sich bewertet, sondern gegen den Terminplan. Aus
Start- und Enddatum ergibt sich ein Soll für den heutigen Tag, und die Differenz
färbt den Balken. Grün bedeutet auf Plan, Gelb einen Rückstand über der ersten
Schwelle, Rot einen darüber hinaus. Die Schwellen lassen sich je Arbeitspaket
einstellen, voreingestellt sind zehn und fünfundzwanzig Prozentpunkte.

Das Seitenpanel zeigt alle sechs Arbeitspakete mit Ist, Soll und verstrichener
Laufzeit. Angezeigt wird dort nicht das Erreichte, sondern der Rest, ab
fünfundsiebzig Prozent mit einem Endspurt-Hinweis. Ein Meilenstein wird erst zur
Bestätigung freigegeben, wenn sein Arbeitspaket bei hundert Prozent steht.

### 2. Kudos von Kollegen

Der Reiter **Team & Kudos** führt einen Feed über abgeschlossene Arbeitspakete,
bestätigte Meilensteine, erledigte Kanban-Karten und Kommentare. Jeder Beitrag
kann von Kolleginnen und Kollegen mit einem Klick gewürdigt werden. Eigene
Beiträge nicht.

Kudos werden bewusst nicht summiert, nicht sortiert und nicht als Rangliste
geführt. Wer keine erhalten hat, taucht in der Übersicht gar nicht erst auf.

Der Reiter **Aufgabenboard** enthält das zugehörige Kanban mit vier Spalten.

### 3. Team-Momentum

Die Sprint-Serie zählt, wie viele Sprints das Team in Folge im Zeitplan
abgeschlossen hat. Sie liegt auf Teamebene, nicht auf Personenebene. Dazu
kommen kurze Feiermomente bei abgeschlossenem Arbeitspaket, bestätigtem
Meilenstein und Sprintende.

Über zwei Schaltflächen im Team-Reiter lässt sich ein Sprint pünktlich oder
verzögert abschließen, um Aufbau und Abriss der Serie zu zeigen.

## Zeiterfassung

Das Modul **MeinKLUSA** ist bewusst anders gebaut. Es gibt keinen täglichen
Streak auf Einzelpersonen, weil eine solche Serie Urlaub und Krankheit
bestraft.

Stattdessen liegt unter der Tabelle ein Monatsraster mit einem Kästchen je
buchungspflichtigem Arbeitstag. Feiertage und Betriebsurlaub sind keine
Kästchen und können den Monat nicht unvollständig machen. Ein Klick auf ein
offenes Kästchen bucht den Tag.

Darunter liegt ein Regal mit einem Abzeichen je lückenlos erfasstem Monat. Das
Abzeichen erscheint automatisch am ersten Arbeitstag des Folgemonats, an allen
anderen Tagen lässt es sich per Klick erneut ansehen. Es geht um
Vollständigkeit, nicht um Tempo, und es wird nicht mit anderen verglichen.

Die Erinnerung an offene Buchungen (oben rechts) ist persönlich einstellbar, mit Uhrzeit und
den Modi leise oder aktiv.

## Nicht gamifiziert

Das Risikomodul bleibt unverändert. Eine Risikobewertung soll eine fachliche
Einschätzung bleiben und darf nicht durch Punkte oder Serien beeinflusst
werden.

## Opt-out

Über das Profilmenü oben rechts lässt sich jede der drei Mechaniken einzeln
abschalten. Abgeschaltete Elemente werden weder angezeigt noch im Hintergrund
erfasst.

## Struktur

```
index.html
styles.css
src/data.jsx          Datenmodell und Demodaten
src/components.jsx    Icons, Avatare, Fortschritt, Kudos, Momentum
src/gantt.jsx         Modul Projekte: Reiter, GANTT, Soll-Ist-Ampel, Panel
src/board.jsx         Kanban-Aufgabenboard
src/team.jsx          Kudos-Feed und Team-Momentum
src/risiken.jsx       Risiken, nicht gamifiziert
src/zeit.jsx          Zeiterfassung, Monatsraster und Abzeichen
src/unternehmen.jsx   Newsfeed
src/login.jsx         Anmeldung
src/app.jsx           App-Shell und Opt-out im Profilmenü
```
