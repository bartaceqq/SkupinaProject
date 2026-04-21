# Závěrečná zpráva projektu: All Unit Converter

## 1. Základní informace

- **Název projektu:** All Unit Converter
- **Jednoduché shrnutí:** Webová aplikace pro rychlý převod měn, délky, váhy, teploty a času. Uživatel zadá hodnotu, vybere jednotky a okamžitě vidí výsledek.
- **Členové týmu a role:**
  - **Role A (UI):** `mrazek4`
  - **Role B (logika):** `bartaceqq`
- **Repozitář:** <https://github.com/bartaceqq/SkupinaProject>

## 2. Cíl aplikace

Cílem aplikace je zjednodušit běžné převody jednotek na jednom místě. Aplikace je určená pro uživatele, kteří potřebují rychle převést hodnotu bez hledání vzorců nebo externích kalkulaček. Typický uživatel je student, cestovatel nebo kdokoli, kdo potřebuje během pár sekund zjistit výsledek převodu.

Aplikace řeší hlavně:
- rychlý převod mezi různými typy jednotek,
- průběžný náhled výsledku už při psaní,
- uložení historie převodů,
- funkčnost i při výpadku připojení.

## 3. Použité technologie

### Frontend a build
- React 19
- Vite 7
- JavaScript (JSX) + TypeScript soubory pro datové/modelové části
- CSS (vlastní styly)

### PWA a offline režim
- `vite-plugin-pwa` (Workbox, `generateSW`)
- Web App Manifest (`public/manifest.json`)
- Service Worker (`dist/sw.js`, generovaný při buildu)

### Data a služby
- Frankfurter API:
  - `https://api.frankfurter.app/latest`
  - `https://api.frankfurter.dev/v1/latest`
- `localStorage` pro draft, historii a cache kurzů

### Kvalita a CI/CD
- ESLint
- GitHub Actions
- GitHub Pages

### AI nástroje
- OpenAI ChatGPT/Codex (konzultace návrhů, úpravy textu, kontrola struktury dokumentace)

## 4. Architektura a struktura komponent

### Přehled architektury

Aplikace je rozdělená na:
- **UI komponenty** (`src/components/**`) pro zobrazení a interakci,
- **hooky** (`src/hooks/**`) pro stav a datové toky,
- **utils/services** (`src/utils/**`, `src/services/**`) pro převodní logiku a volání API,
- **data** (`src/data/**`) pro statické seznamy kategorií, jednotek a převodních faktorů.

Centrálním bodem je hook `useConverterApp()`, který drží hlavní stav aplikace a předává data/akce komponentám přes props.

### Komponenty a jejich props

| Komponenta | Co zobrazuje | Props |
|---|---|---|
| `AppLayout` | Hlavní kostra stránky (`header/main/footer`) | `header`, `children`, `footer` |
| `PageHeader` | Titulek aplikace | `kicker`, `title`, `subtitle` |
| `CategoryTabs` | Přepínač kategorií převodu | `categories`, `activeCategoryId`, `onChange`, `panelId` |
| `ConverterField` | Pole pro vstup/výstup + výběr jednotky | `label`, `value`, `units`, `selectedUnitId`, `onValueChange`, `onUnitChange`, `readOnly`, `helperText`, `isInvalid`, `ariaLive` |
| `SwapButton` | Tlačítko prohození jednotek | `onClick` |
| `ConvertButton` | Potvrzení převodu a zápis do historie | `disabled`, `onClick` |
| `HistorySection` | Sekce historie + tlačítko „Vymazat vše“ | `history`, `onApplyItem`, `onClearAll` |
| `HistoryItem` | Jedna položka historie (klikem vrátí hodnoty do formuláře) | `item`, `onApply` |
| `RateInfoCard` | Stav měnových kurzů a ruční refresh | `visible`, `loading`, `error`, `rateText`, `effectiveDate`, `lastUpdated`, `source`, `onRefresh` |
| `StatusMessage` | Stavová zpráva dole na stránce | `tone`, `text`, `compact` |
| `ConfirmModal` | Potvrzovací dialog pro smazání historie | `open`, `title`, `description`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel` |

### Tok dat mezi komponentami

1. `useConverterApp()` vytvoří stav aplikace (kategorie, hodnota, jednotky, historie, stav kurzů).
2. `App.jsx` předá stav dolů přes props do komponent (`CategoryTabs`, `ConverterField`, `HistorySection`, `RateInfoCard`).
3. Uživatelské události (klik, změna inputu/selectu) vrací komponenty nahoru přes callback props (`setAmount`, `setCategory`, `swapUnits`, `submitConversion`, ...).
4. Callbacky v `useConverterApp()` aktualizují reducer/localStorage a React překreslí UI.

### Strom komponent

```text
App
├── AppLayout
│   ├── wireframe-card
│   │   ├── PageHeader
│   │   ├── CategoryTabs
│   │   ├── converter-panel
│   │   │   ├── ConverterField (vstup)
│   │   │   ├── SwapButton
│   │   │   ├── ConverterField (výstup, readOnly)
│   │   │   └── ConvertButton
│   │   ├── HistorySection
│   │   │   └── HistoryItem[]
│   │   └── RateInfoCard
│   └── StatusMessage
└── ConfirmModal (portal do document.body)
```

## 5. Správa stavu

### Kde se drží stav

Hlavní stav je v `useConverterApp`:
- `category`, `amount`, `fromUnitId`, `toUnitId`
- `isClearHistoryModalOpen`, `hasTriedConversion`
- odvozené hodnoty: `previewResult`, `statusMessage`, `rateInfo`, `isAmountInvalid`

Historie je spravovaná přes `useLocalStorage`, takže zůstává po obnově stránky.

### Co se ukládá do localStorage

1. **Draft formuláře**
- Klíč: `unit-converter-draft`
- Formát:
```json
{
  "category": "currency",
  "amount": "100",
  "fromUnitId": "eur",
  "toUnitId": "czk"
}
```

2. **Historie převodů**
- Klíč: `unit-converter-history`
- Formát:
```json
[
  {
    "id": "uuid",
    "result": {
      "input": 100,
      "output": 2490,
      "fromUnit": "eur",
      "toUnit": "czk",
      "category": "currency"
    },
    "createdAt": "2026-04-20T09:15:00.000Z"
  }
]
```

3. **Cache měnových kurzů**
- Klíč: `unit-converter-rates-v1:<base>` (např. `unit-converter-rates-v1:eur`)
- Formát:
```json
{
  "base": "eur",
  "date": "2026-04-20",
  "rates": {
    "eur": 1,
    "czk": 24.72,
    "usd": 1.09
  }
}
```

### Příklad toku po akci uživatele

Uživatel klikne na tlačítko **Převést**:
1. zavolá se `submitConversion()`,
2. hook označí pokus o převod (`markConversionAttempt`),
3. pokud je vstup platný, vytvoří se `createHistoryEntry(previewResult)`,
4. historie se uloží přes `setHistory(...)` do `localStorage`,
5. React překreslí `HistorySection` a nová položka je vidět nahoře.

## 6. Nasazení

### Kde aplikace běží

- Produkční nasazení je přes **GitHub Pages**.
- Workflow: `.github/workflows/deploy-pages.yml`.

### Build a výstupy

- Build příkaz:
```bash
npm run build
```
- Výstupní složka: `dist/`
- Důležité artefakty:
  - `dist/index.html`
  - `dist/assets/*`
  - `dist/manifest.json`
  - `dist/sw.js`

### Jak probíhá deploy

1. Push do větve `main`.
2. GitHub Actions spustí:
   - `npm ci`
   - `npm run lint`
   - `npm run build`
3. Obsah `dist/` se publikuje na GitHub Pages.

### Odkaz na běžící aplikaci

<https://bartaceqq.github.io/SkupinaProject/>

## 7. PWA

### Strategie service workeru

Service worker je generovaný přes Workbox (`vite-plugin-pwa`, režim `generateSW`):
- při instalaci precacheuje statické soubory buildu (`js`, `css`, `html`, `png`, `svg`, `ico`, `json`),
- pro API kurzy (`api.frankfurter.app` a `api.frankfurter.dev`) používá strategii **StaleWhileRevalidate**,
- cache pro kurzy má limit:
  - `maxEntries: 5`
  - `maxAgeSeconds: 3600` (1 hodina).

### Chování bez připojení

- UI a statické soubory fungují z precache.
- Pokud nejde API:
  1. použije se lokální cache kurzů (`local-cache`),
  2. pokud není, použijí se vestavěné offline kurzy (`local-fallback`).
- Uživatel vidí stav přes `StatusMessage` a `RateInfoCard`.

### Lighthouse audit (PWA)

- Screenshot z Lighthouse auditu: **doplnit do příloh** (např. `docs/lighthouse-pwa.png`).
- Komentář k výsledku:
  - díky manifestu a service workeru by měly projít základní PWA kontroly (installable/offline),
  - případné neúspěšné body bývají nejčastěji v detailních doporučeních (např. ikony, metadata nebo best practices mimo PWA jádro).

## 8. Testování

### Technická kontrola

- `npm run lint` -> bez chyb
- `npm run build` -> úspěšný build + vygenerovaný service worker

### Manuální testovací scénáře

| # | Vstupní podmínka | Kroky | Očekávaný výsledek | Skutečný výsledek |
|---|---|---|---|---|
| 1 | Kategorie Měna, vstup `100`, `EUR -> CZK` | Klik na `Převést` | Vznikne výsledek a uloží se do historie | Odpovídá očekávání |
| 2 | Vyplněný formulář, různé `from/to` jednotky | Klik na tlačítko prohození | Jednotky se prohodí, výsledek se přepočítá | Odpovídá očekávání |
| 3 | Prázdné pole hodnoty | Klik na `Převést` | Převod se neprovede, zobrazí se nápověda pro zadání hodnoty | Odpovídá očekávání |
| 4 | Do vstupu zadáno `abc` | Pokus o převod | Zobrazí se chyba „Zadejte platné číslo…“ | Odpovídá očekávání |
| 5 | Kategorie Teplota, vstup pouze `-` | Uživatelský pokus během psaní | Nevyvolá se předčasná tvrdá chyba během rozepsaného záporného čísla | Odpovídá očekávání |
| 6 | Historie je prázdná | Otevření sekce Historie | Tlačítko „Vymazat vše“ je neaktivní | Odpovídá očekávání |
| 7 | Simulovaný výpadek API kurzů | Klik na „Aktualizovat kurzy“ | Aplikace použije cache nebo fallback kurzy, UI zobrazí varování | Odpovídá očekávání |

### Automatické testy

V repozitáři nejsou implementované jednotkové/integrační testy (Jest/Vitest/Cypress). Ověření probíhalo manuálně + lint/build kontrolou v CI.

## 9. Rozdělení práce

### Role A (UI) – `mrazek4`
- návrh a implementace prezentačních komponent,
- layout a responzivní styly (`App.css`, `index.css`),
- UI interakce (taby, pole, modal, historie, tlačítka).

### Role B (logika) – `bartaceqq`
- stavová logika (`useConverterApp`, `useFetch`, `useCurrencyRates`, `useLocalStorage`),
- převodní logika (`utils/converters.ts`, `utils/formatters.ts`),
- napojení na měnové API + fallbacky (`currencyService.ts`),
- PWA konfigurace + CI/CD deploy na GitHub Pages.

### Společná práce
- integrace UI a logiky do finální aplikace,
- ladění UX, validací vstupu a finálního nasazení,
- příprava dokumentace.

## 10. Zhodnocení projektu

### Co se podařilo
- aplikace pokrývá 5 kategorií převodů v jednom rozhraní,
- funguje i v offline režimu (precache + fallbacky kurzů),
- přehledná historie převodů a rychlé opětovné použití položek,
- automatizovaný deploy přes GitHub Actions.

### Co bylo problematické
- sladění UI a logiky ve více iteracích zabralo více času,
- řešení okrajových stavů vstupu (neplatné číslo, rozepsané záporné číslo) vyžadovalo dodatečné úpravy,
- měnové API není stoprocentně spolehlivé, bylo nutné doplnit fallback vrstvy.

### Co by šlo dál rozvíjet
- přidat automatické testy (unit + integrační + e2e),
- rozšířit množinu měn a jednotek,
- přidat graf vývoje kurzu a oblíbené převodní páry,
- export/import historie nebo synchronizaci mezi zařízeními.

## 11. Přílohy

1. **Původní wireframe (1. týden):**
   - `docs/wireframe.png`
2. **Aktualizované návrhy:**
   - aktuální UI je přímo v implementaci (`src/App.jsx`, `src/App.css`)
3. **Screenshoty finální aplikace:**
   - desktop: doplnit (`docs/screenshot-desktop.png`)
   - mobil: doplnit (`docs/screenshot-mobile.png`)
4. **Lighthouse PWA audit screenshot:**
   - doplnit (`docs/lighthouse-pwa.png`)

---

## Poznámka k odevzdání

Pro Moodle odevzdat PDF verzi tohoto dokumentu (`docs/zaverecna-zprava.pdf`).
