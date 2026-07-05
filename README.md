# CartScreen — Website

Die öffentliche Landingpage für CartScreen: der münzfreie, app-verbundene Einkaufswagen.
Inhaltlich auf die fünf V1-Funktionen ausgerichtet (Laden per Stecker, Entsperren per
Display/App, Werbung + Orientierung, Alarm, Standort-Tracking — siehe `../docs/PRODUCT.md`).
Eine statische Seite ohne Build-Schritt — reines HTML/CSS/JS.

## Ansehen

```bash
# einfachste Variante: Datei direkt öffnen
open index.html

# oder mit lokalem Server (empfohlen, lädt Schriften & Assets sauber)
python3 -m http.server 8080   # → http://localhost:8080
```

## Struktur

Mehrseitige Seite: pro Navigationspunkt eine eigene HTML-Datei (kein Infinite-Scroll).
Geteilte Bausteine (Nav/Footer) sind in jeder Seite eingebettet, das CSS ist nach
Aufgabe in `css/` aufgeteilt.

```
website/
├── index.html             ← Startseite (Hero, Strip, fünf Funktionen, Überblick, CTA)
├── problem-loesung.html   ← Problem + Lösung (eine Seite, scrollbar: #problem, #loesung)
├── modul-analytik.html    ← Modul + Analytik (eine Seite, scrollbar: #modul, #system, #analytik)
├── team.html              ← Team
├── faq.html          ← Häufige Fragen
├── kontakt.html      ← Kontakt / Pilot anfragen
├── impressum.html    ← Impressum
├── datenschutz.html  ← Datenschutzerklärung
├── css/
│   ├── base.css         ← Design-Tokens, Reset, Atmosphäre, geteilte Primitive
│   ├── layout.css       ← Navigation + Footer
│   ├── components.css   ← Inhaltsbausteine (Hero, Karten, Schritte, Modul, …)
│   └── legal.css        ← Rechtsseiten
├── js/
│   └── main.js          ← Scroll-Reveals + Hero-Parallax (vanilla, keine Deps)
├── README.md
└── assets/
    ├── img/favicon.svg   ← Logo (entspricht dem App-Branding)
    └── renders/          ← PCB-Renderings (siehe unten)
```

Jede Inhaltsseite lädt `base.css` + `layout.css` + `components.css`; die Rechtsseiten
laden `base.css` + `legal.css`.

## Design

Das visuelle System ist aus der CartScreen-iOS-App abgeleitet (`/CartScreen/Theme.swift`), damit
App und Web dieselbe Sprache sprechen:

- **Farben** — warmes Creme (`#F7F6F2`), Tannengrün → Mint (`#0F5941`→`#34D399`),
  ein einziger Akzent in Orange (`#F59E0B`, „der Schlüssel").
- **Typografie** — *Bricolage Grotesque* (Display), *Hanken Grotesk* (Text),
  *JetBrains Mono* (technische Labels). Geladen via **Google Fonts** (CDN-`<link>` im
  `<head>` jeder Seite; keine lokal gehosteten Schriftdateien mehr).
- **Haltung** — editorial, ruhig, „European hardware atelier". Viel Weißraum,
  schwebende Platine als Hero-Objekt, dezentes Korn + weiche Brand-Glows.

## PCB-Renderings

Die Bilder unter `assets/renders/` sind **echte Renderings aus den KiCad-Daten**
(`hardware/cartscreen_v1/cartscreen_v1_80_routed.kicad_pcb`), erzeugt mit `kicad-cli` (KiCad 10).
Keine Fotos — die Platine ist noch nicht gefertigt. Reproduzieren:

```bash
PCB=../hardware/cartscreen_v1/cartscreen_v1_80_routed.kicad_pcb
OUT=assets/renders

# Hero (isometrisch, mit Boden-Schatten)
kicad-cli pcb render -o $OUT/pcb-hero.png  -w 2400 -h 1800 --side top \
  --quality high --perspective --floor --rotate "-24,0,28" --zoom 0.9 \
  --background transparent $PCB

# Draufsicht / Winkel / Unterseite analog mit --side bzw. --rotate,
# danach Transparent-Rand trimmen:  magick FILE -trim +repage -border 24 FILE
```

## Noch vom Team zu bestätigen (Platzhalter)

- **Kontakt-Mail** — gesetzt auf `info.cartscreen@gmail.com` (CTA-Sektion, erledigt).
- **Team-Rollen** (Hardware / Produkt / App) sind aus dem Repo abgeleitet, bitte gegenchecken.
- Optional eigene **Domain** + OG-Vorschaubild ergänzen.

## Stand

Bewusst ehrlich gehalten: Die Seite kommuniziert offen die frühe Phase
(Konzept + Board designt, Stage EVT-1, noch nicht gebaut). Kein Verkaufsangebot.
