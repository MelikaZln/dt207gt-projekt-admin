# Front-end: Admin

Front-end till detta projekt har två delar en user och en admin-del, här sak jag beskriva admin delen.
Denna del har två undersidor, en start sida där man loggar in och en undersida där den inloggda adminen kan nå.
Jag har också två script filer, en till index.html och den andra till undersidan.

I package.json skrev jag "start": "http-server", för att kunna starta sidan genom att skriva npm start.

Först börjar jag med att beskriva script till index och sedan undersidan.

registerUser():en funktion som registrerar en ny administratör. Den hämtar användarinformation från registreringsformuläret, 
skapar en POST-förfrågan till servern för att skicka användarinformationen och få ett svar tillbaka.

loginUser(): En funktion för att logga in en administratör. Den hämtar inloggningsuppgifter från inloggningsformuläret, skapar
en POST-förfrågan till servern för att verifiera användaruppgifterna och få ett JWT-token tillbaka om inloggningen är framgångsrik.

getToken(): är en funktion som hämtar JWT-token från webbläsarens localStorage.

checkLoggedIn():  En funktion som körs när sidan laddas för att kontrollera om en admin är inloggad. Den använder getToken()
för att hämta JWT-token från localStorage. Om en token finns och användaren är på en skyddad sida (till exempel "undersida.html"), 
välkomnas användaren och sidan stannar kvar. Annars omdirigeras användaren till inloggningssidan ("index.html")

DOMContentLoaded-händelse: En händelse som triggas när DOM har laddats helt. Inuti denna händelsefunktion anropas checkLoggedIn() för att kontrollera användarens inloggningstillstånd när sidan laddas.

Så det var script till första sidan där admin loggar in, efter att ha loggat in kommer man till undersida.html och här nedanför beskrivs scriptundersida.js: 

På denna sida kan man se alla bokningar, tabort eller redigera menuitem och lägga till ny menu item till slut ska man logga ut. 
