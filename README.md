# Prenumerationskollen – mobilapp

En mobilapp för att hålla koll på sina prenumerationer (t.ex. Netflix, Spotify) — vilka som är aktiva, vilka som snart startar och vilka som har avslutats.
Appen är byggd med React Native och Expo och använder samma backend som webbappen, så det som ändras i mobilen syns också i webbappen och tvärtom.

## Funktioner
- Lista med status **Aktiv**, **Kommande** och **Avslutad**, dra ner för att uppdatera
- Sök bland prenumerationer på namn eller anteckning
- Fem kort visas först, resten med **Visa fler**
- Lägga till en prenumeration ovanför listan (POST)
- Detaljvy där namn, anteckning, status och datum kan ändras (PUT)
- Datumväljare, ✕ tar bort slutdatumet så att prenumerationen blir pågående
- Förloppsindikator, t.ex. "32 dagar kvar" eller "Utgången"
- Ladda upp logga (📷) och dokument (PDF eller bild) från telefonen; tryck på loggan för att visa den och på dokumentet för att öppna det. Netflix, Spotify och Viaplay har inbyggda loggor som i webbappen
- Pris per månad; listan visar summan för aktiva och kommande prenumerationer och ungefär hur mycket som betalats hittills, även per prenumeration i detaljvyn
- Felmeddelanden i stället för krasch om API:et inte svarar
- Samma logga och färgtema som webbappen

## Så hänger delarna ihop

Projektet består av tre separata repon som använder samma API:

| Repo | Innehåll | Adress |
|---|---|---|
| [PrenumerationerApi](https://github.com/AigennA/PrenumerationerApi) | Backend (ASP.NET Web API) | http://localhost:5175 |
| [prenumerationer-app](https://github.com/AigennA/prenumerationer-app) | Webbapp (React + Vite) | http://localhost:5173 |
| [prenumerationer-mobil](https://github.com/AigennA/prenumerationer-mobil) | Mobilapp (React Native + Expo) | Expo Go / emulator |

```
 Webbapp (React)  ──┐
                    ├──  HTTP + JSON  ──►  PrenumerationerApi (ASP.NET)
 Mobilapp (RN)    ──┘
```

Webbappen och mobilappen anropar samma endpoints (`GET`, `POST` och `PUT` på `/api/prenumerationer`).
Webbappen körs i webbläsaren och behöver därför en CORS-inställning i API:et. Mobilappen körs som en native app och påverkas inte av CORS, men telefonen måste kunna nå datorn där API:et körs över nätverket (se nedan).

## Kom igång

> **Viktigt:** Starta alltid API:et först. Mobilappen hämtar data från API:et direkt när den öppnas.

### Förutsättningar
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20.19 eller senare
- Git
- Ett av följande:
  - appen **Expo Go** på en mobil (iPhone eller Android) i samma wifi-nätverk som datorn, eller
  - en Android-emulator (Android Studio)

### 1. Klona API:et och mobilappen i samma mapp
```
git clone https://github.com/AigennA/PrenumerationerApi.git
git clone https://github.com/AigennA/prenumerationer-mobil.git
```
**Valfritt:** öppna båda projekten i samma VS Code-fönster med **File → Open Folder…**, markera `PrenumerationerApi` och `prenumerationer-mobil` och klicka **Välj mapp**. VS Code skapar då en arbetsyta med båda, så att de kan köras i var sin terminal.

### 2. Starta API:et (terminal 1)
```
cd PrenumerationerApi
dotnet run --urls http://0.0.0.0:5175
```
`--urls http://0.0.0.0:5175` gör att API:et tar emot anrop från andra enheter i nätverket (t.ex. mobilen), inte bara från datorn själv.
Om Windows brandvägg frågar om åtkomst: välj **Tillåt**.

### 3. Starta mobilappen (terminal 2)
Öppna en ny terminal i samma mapp som i steg 1.
```
cd prenumerationer-mobil
npm install
npx expo start
```

**På en mobil med Expo Go:** skanna QR-koden som visas i terminalen (med kameran på iPhone, i Expo Go på Android).
Appen räknar själv ut datorns IP-adress och anropar API:et på port 5175.

**I en Android-emulator:** emulatorn når datorn via adressen `10.0.2.2`. Ange den innan appen startas och tryck sedan `a` i terminalen:
```
# PowerShell
$env:EXPO_PUBLIC_API_URL = "http://10.0.2.2:5175"
npx expo start

# macOS / Linux / Git Bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:5175 npx expo start
```
Med emulatorn räcker det att starta API:et med `dotnet run`.

### Om något inte fungerar
- **"Kunde inte ansluta till servern."** — kontrollera att API:et är igång, att datorn och mobilen är i samma nätverk och att API:et startades med `--urls http://0.0.0.0:5175`. Adressen som appen försöker nå visas under felmeddelandet. Tryck sedan på **Försök igen**.
- **Appen visar gammal kod eller hittar inte en fil** — starta om med rensad cache: `npx expo start -c`
- **Datan är tillbaka som från början** — API:et sparar prenumerationerna i minnet, så allt återställs när API:et startas om. Ingen databas krävs i uppgiften.

## Projektstruktur
```
src/
  app/                          Skärmar (expo-router: en fil = en skärm)
    _layout.tsx                 Gemensam header med logga och navigering (Stack)
    index.tsx                   Listan och fältet för ny prenumeration
    prenumeration/[id].tsx      Detaljvyn
  components/                   Återanvändbara komponenter
  constants/colors.ts           Färgerna (samma tema som webbappen)
  services/prenumerationApi.ts  Alla anrop till API:et
  types/prenumeration.ts        Datatypen, samma fält som C#-modellen i API:et
  utils/                        Hjälpfunktioner för datum, status och period
assets/images/logo.png          Appens logga (samma som i webbappen)
```

## Tekniska val

- **TypeScript** (webbappen är JavaScript): typen `Prenumeration` har samma fält som C#-modellen, så fel syns i editorn innan appen körs.
- **expo-router** i stället för React Navigation från lektionen: samma native-stack, men varje fil i `src/app` blir en skärm.
- **StyleSheet**: inbyggt, ingen extra konfiguration. Färgerna ligger i `constants/colors.ts`, samma tema som webbappen.
- **Ett ställe för API-anrop**: `services/prenumerationApi.ts` gör om nätverksfel till svenska felmeddelanden.
- **Lägg till direkt i listan**, som i lektionens uppgiftslista. Resten ställs in i detaljvyn, så inget separat formulär behövs.
- **Datumväljare**: `@react-native-community/datetimepicker` fungerar i Expo Go. Hjul på Android (lätt att byta år), kalender på iOS.
- **AsyncStorage för priset**: API:et har inget prisfält och ändrades inte efter inlämningen, så priset sparas lokalt i telefonen (motsvarigheten till `localStorage` på webben). Nackdelen är att priset bara finns på den enheten och inte syns i webbappen.
- **expo-image-picker** och **expo-document-picker** väljer filer från telefonen och fungerar i Expo Go. Filerna skickas som `FormData` till samma upload-endpoints som webbappen använder.

**Lektionens komponenter** har samma grundstruktur men har fått TypeScript-typer, appens färger och data från API:et:

| Lektionen | I appen |
|---|---|
| Avatar | `Avatar` – första bokstaven i tjänstens namn |
| StatusBadge | `StatusBadge` – Aktiv / Kommande / Avslutad |
| ProfileCard | `PrenumerationCard` – kortet i listan |
| TaskList | `PrenumerationList` – FlatList med dra-för-att-uppdatera |
| PressableButton | `PressableButton` – t.ex. Lägg till, Spara ändringar och Försök igen |
| ToggleSwitch | `ToggleSwitch` – aktiv/avslutad |
| ProgressBar | `ProgressBar` – hur stor del av perioden som har gått |

`ToggleSwitch` har inget eget `useState` som på lektionen; värdet kommer in som props så att detaljvyn kan spara det i API:et.
