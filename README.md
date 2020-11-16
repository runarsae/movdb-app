# MovDB <img width="400" src="documentation/mockups.png" align="right">

MovDB er en applikasjon for informasjon om nærmere 3000 filmer. Den inneholder et søkegrensesnitt hvor man kan søke etter både tittel og beskrivelse. Videre kan man filtrere filmene etter sjanger, lanseringsår og varighet. De kan også sorteres etter rating, tittel (alfabetisk), varighet og lanseringsår, både i stigende og synkende rekkefølge. Resultatene presenteres i en listebasert visning, hvor man kan scrolle nedover for å laste inn flere. Hver film i listen kan trykkes på. Da vises en popup med mer informasjon om filmen og dens trailer.

## Systemkrav

For å kjøre applikasjonen lokalt er følgende nødvendig:

-   [Node.js](https://nodejs.org/en/download/)
-   [Expo CLI](https://docs.expo.io/workflow/expo-cli/) (installert globalt)
-   Expo Client på [iOS](https://apps.apple.com/app/apple-store/id982107779) eller [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) (mobilenhet eller simulator)

## Installering og kjøring

Klon repoet:

```
git clone https://gitlab.stud.idi.ntnu.no/it2810-h20/team-23/runar/prosjekt-4.git
```

Naviger til rotmappen av prosjektet og installer avhengigheter:

```
npm install
```

Start Expo Developer Tools:

```
expo start
```

Et vindu i nettleseren vil åpnes, og herfra kan du kjøre applikasjonen på ønsket plattform. Merk at applikasjonen fungerer kun på iOS og Android.

## Teknologi

### React Native og TypeScript

Prosjektet er initialisert gjennom Expo, med TypeScript som implementasjonsspråk. Det er brukt en strict versjon av TypeScript, hvor alle variabler, parametere og returverdier er typedefinert. Dette sikrer at man unngår typefeil under utvikling og det gir mer struktur til koden.

Komponentene som er implementert består hovedsakelig av kjernekomponentene som finnes i React Native. Her er det blant annet brukt Stylesheet, View, ScrollView, FlatList, Text, Image og touchables, for å nevne noen. Det er også brukt flere [tredjepartskomponenter](#tredjepartskomponenter) for spesifikke elementer. Det overordnede komponenttreet er illustrert i figur 1. Hver komponent er dokumentert gjennom kommentarer i koden der det er følt at det er fornuftig for forståelsen.

<img width="556" height="485" src="documentation/component_tree.png">

_Figur 1: Applikasjonens komponenttre_

### Backend

Backend er i sin helhet gjenbrukt fra prosjekt 3 og er installert på virtuell maskin hos IDI. For mer informasjon om backend henvises det til [prosjekt 3](https://gitlab.stud.idi.ntnu.no/it2810-h20/team-23/prosjekt-3).

### Gjenbruk av kode

React Native legger opp til mye gjenbruk av kode fra en vanlig React-applikasjon, som implementert i prosjekt 3. I frontend er tilnærmet all logikk for hver komponent gjenbrukbar, i tillegg til det brukte systemet for local state management (Apollo Client). Det er først og fremst erstatning av UI-komponenter, til kjernekomponenter i React Native og tredjepartskomponenter, som er den store forskjellen. Dette åpner opp for mobil-spesifikk oppførsel som ikke er mulig i en webapplikasjon. Likevel er strukturen til komponentene lik React-applikasjonens komponenter. Når det kommer til backend er denne fullt gjenbrukbar, da den fungerer som en separat enhet som serverer data. Både React-applikasjonen fra prosjekt 3 og denne React Native-applikasjonen bruker akkurat samme data på samme måte.

### Tredjepartskomponenter og bibliotek

Tredjepartskomponentene og bibliotekene listet opp nedenfor er tatt i bruk for å forenkle koden, i form av at de tilbyr funksjonalitet som ellers ville ha krevd mye kode ved implementering fra bunnen av.

-   **[Apollo Client](https://www.apollographql.com/docs/react/)**<br>
    Håndtering av lokal state, i tillegg til spørringer mot backend. Lokal state lagres i _reactive variables_, definert i [Store.tsx](Store.tsx). Disse kan nås fra alle komponenter i applikasjonen gjennom clienten, som distribueres av ApolloProvider i roten av komponenttreet. Når en reactive variable endres, vil komponenter som avhenger av denne variabelen rendres på nytt basert på den nye verdien. Dette fungerer utmerket for denne applikasjonens formål, da søk, filtrering og sortering skjer i separate komponenter. Verdiene lagres i lokal state og brukes av MovieContainer for å hente de riktige filmene. Når for eksempel søket endres, vil spørringen mot backend i MovieContainer gjøres på nytt med den nye søkeverdien. Som nevnt håndterer Apollo Client spørringer mot backend også. Dette gjøres med spørrespråket GraphQL. Spørringene som brukes i applikasjonen og deres typedefinisjoner er i [Queries.tsx](Queries.tsx).

-   **[react-native-paper](https://callstack.github.io/react-native-paper/)**<br>
    Grunnleggende UI-komponenter i Material Design-stil. Forenkler stiling og bygging av større komponenter. Komponentene som er brukt er knapper, tekst, overflater, chips, app bar og cards, for å nevne noen. React Native Paper muliggjør også themeing for alle komponenter i applikasjonen. Temaet som er brukt er definert i [App.tsx](App.tsx), og distribueres av ThemeProvider i roten av komponentstrukturen.

-   **[react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)**<br>
    Bibliotek med over 3000 ikoner. Brukes av React Native Paper for å vise ikon. Er brukt i de fleste komponentene, blant annet i header-knappene, sorteringsmenyen, søkemenyen, movie card og movie popup.

-   **[react-native-animatable](https://github.com/oblador/react-native-animatable)**<br>
    Bibliotek for deklarative animasjoner og overganger. Brukes for å skli filtreringsmeny, film-popup, sorteringsmeny og søkemeny inn og ut av skjermen. Biblioteket er valgt da det føles enklere og mer intuitiv å bruke enn det innebygde animasjonsbiblioteket i React Native.

-   **[react-native-status-bar-height](https://www.npmjs.com/package/react-native-status-bar-height)**<br>
    Bibliotek som gir høyden til statusbaren for både iOS- og Android-enheter Denne brukes for at innholdet i applikasjonen ikke skal komme under statusbaren og er valgt da den tilsvarende kjernekomponenten i React Native kun fungerer for Android. En annen løsning kunne ha vært å bruke [SafeAreaView](https://reactnative.dev/docs/safeareaview), men denne fungerer kun på iOS.

-   **[@ptomasroos/react-native-multi-slider](https://github.com/ptomasroos/react-native-multi-slider)**<br>
    Komponent for slider hvor et intervall av verdier kan velges. Brukes i filtreringsmenyen for filtrering på lanseringsår og lengde på film.

-   **[react-native-webview](https://github.com/react-native-webview/react-native-webview)** og **[react-native-youtube-iframe](https://lonelycpp.github.io/react-native-youtube-iframe/)**<br>
    Komponenter for å vise web-innhold i en React Native-applikasjon. react-native-youtube-iframe bruker webview for å vise youtube-videoer. Brukes i movie popup for å vise traileren til den valgte filmen.

## Testing

Applikasjonen er manuelt end-2-end-testet på ...

## Git

Git og GitLab er brukt under utviklingen av applikasjonen. Det er opprettet et issue for hver utviklingsoppgave, med en tilhørende branch og merge request inn til hovedbranchen. Issues er markert med labels for å tydeliggjøre hva de innebærer. Siden prosjektet er gjennomført av én person, er det ikke fokusert på samhandlingsmekanismer, som code reviews. Merge conflicts har heller ikke vært et problem, da et issue ble gjort ferdig før neste ble begynt på.
