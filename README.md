# Prenumerationskollen – mobilapp

En mobilapp för att hålla koll på sina prenumerationer (t.ex. Netflix, Spotify) — vilka som är aktiva, vilka som snart startar och vilka som har avslutats.
Appen är byggd med React Native och Expo och använder samma backend som webbappen, så det som ändras i mobilen syns också i webbappen och tvärtom.

## Funktioner
- Lista alla prenumerationer med status: **Aktiv** (grön), **Kommande** (blå, startdatum i framtiden) och **Avslutad** (grå)
- Dra ner listan för att uppdatera den
- Lägga till en ny prenumeration direkt ovanför listan (POST) — detaljvyn öppnas sedan automatiskt
- Detaljvy för varje prenumeration (tryck på ett kort)
- Ändra namn och anteckning och spara med **Spara ändringar** eller Enter (PUT)
- Slå på/av en prenumeration med en switch (PUT)
- Ändra start- och slutdatum med telefonens datumväljare (PUT)
  - Ett slutdatum i framtiden betyder att prenumerationen fortfarande är aktiv
  - Ett slutdatum som har passerat gör den avslutad
  - ✕ tar bort slutdatumet så att prenumerationen blir pågående igen
- Felmeddelanden visas om ett anrop till API:et misslyckas — appen kraschar inte
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
  utils/                        Hjälpfunktioner för datum och status
assets/images/logo.png          Appens logga (samma som i webbappen)
```

## Tekniska val

**TypeScript i mobilappen, JavaScript i webbappen.**
Webbappen skapades med Vites JavaScript-mall. Mobilappen skapades med `create-expo-app`, vars mall använder TypeScript. Jag valde att behålla det eftersom typen `Prenumeration` har exakt samma fält som C#-modellen i API:et. Stavar jag fel på ett fält eller skickar fel typ av värde syns felet direkt i editorn, innan appen körs.

**expo-router i stället för React Navigation.**
På lektionen använde vi React Navigation med `native-stack`. expo-router bygger på samma native-stack men använder filbaserad routing: varje fil i `src/app` blir en skärm. Det blir mindre kod med samma beteende (header och tillbaka-knapp).

**StyleSheet i stället för ett stylingbibliotek.**
React Native har inga CSS-filer, stilarna skrivs som JavaScript-objekt med `StyleSheet.create`. Jag valde det inbyggda sättet eftersom det inte kräver extra konfiguration och är det vi använde på lektionen. Färgerna ligger samlat i `constants/colors.ts`, motsvarigheten till CSS-variablerna i webbappen, så båda apparna har samma tema.

**Ett ställe för API-anrop.**
Alla anrop går via `services/prenumerationApi.ts` och en gemensam `request`-funktion. Den gör om nätverksfel och felkoder till svenska felmeddelanden, så att skärmarna bara behöver visa meddelandet.

**Lägga till direkt i listan.**
Precis som i lektionens uppgiftslista finns ett textfält och en Lägg till-knapp ovanför listan. Bara namnet krävs; datum och status ställs in i detaljvyn som öppnas direkt efteråt. På så sätt återanvänds samma komponenter i stället för att bygga ett separat formulär.

**Lektionens komponenter, anpassade till appen.**
Komponenterna från lektionen har samma grundstruktur men har fått TypeScript-typer, appens färger och riktig data från API:et:

| Lektionen | I appen |
|---|---|
| Avatar | `Avatar` – första bokstaven i tjänstens namn |
| StatusBadge | `StatusBadge` – Aktiv / Kommande / Avslutad |
| ProfileCard | `PrenumerationCard` – kortet i listan |
| TaskList | `PrenumerationList` – FlatList med dra-för-att-uppdatera |
| PressableButton | `PressableButton` – t.ex. Lägg till, Spara ändringar och Försök igen |
| ToggleSwitch | `ToggleSwitch` – aktiv/avslutad |

I lektionens `ToggleSwitch` ligger värdet i komponentens egen `useState`. I appen skickas värdet och `onValueChange` in som props i stället, så att detaljvyn kan spara ändringen i API:et.

**Datumväljare.**
`@react-native-community/datetimepicker` öppnar telefonens egen datumväljare och fungerar i Expo Go. På Android visas hjul (spinner) för dag, månad och år eftersom det gör det lätt att byta år. På iOS visas en kalender i vyn.
