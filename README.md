## Beschrijving

Deze smartphone applicatie is bedoeld voor gebruikers die snel het weer willen weten in hun favoriete steden. Deze steden kunnen worden toegevoegd, gewijzigd of verwijderd. 

## Motivatie

Een smartphone is snel binnen bereik. De meesten van de huidige generatie heeft zo'n ding zitten, daarom dacht ik aan een applicatie om snel even het weer is je favoriete  steden te bekijken.

## Installatie

- Voer het databankscript uit die in de DB map zit (ik heb hier geen truncate statements ingevoegd want je maakt een lege tabel aan)
- Laat het project uivoeren in een serveromgeving bv usbwebserver, wamp, mamp, ....
- Bij voorkeur de applicatie te openen met Firefox Mobile, safari, ... Liefst geen Google Chrome (die doet wat raar met de geolocatie)
- Fullscreen API werkt NIET op safari

## Databank

Logingegevens zoals username en passwoord worden opgeslaan in de database alsook hun favoriete steden
waar het weer van opgehaald moet worden.

## API Reference

openweathermap: http://openweathermap.org/current

google maps: 	https://developers.google.com/maps/documentation/javascript/	 	

fullscreen:     https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API 


## Features

Orientatie 	Wanneer de gebruiker de orientatie van het toestel wijzigt (horizontaal) zal een kaart getoond worden
                die gecentreerd staat op de huidige locatie (bepaald met geolocatie). 
                Dit gebeurt alleen na de registratie

Gestures 	Bij het naar links swipen wordt een knop getoond om een stad te verwijderen (in pagina 'mijn steden').
                Wanneer je naar rechts swiped verdwijnt deze knop weer.

                bij het lang tikken op de naam van een stad kan deze worden gewijzigd (in pagina 'mijn steden')

## Gekende fouten

- Wachtwoorden van gebruikers worden niet gehashed in de databank (zeer raar gedrag bij het hashen)
- Gegenereerde jquerymobile elementen worden niet altijd correct weergegeven (zie uitleg in de code)

## Bronvermeldingen

- Jquerymobile framework
- Afbeeldingen komen uit google images
- Iconen komen uit http://www.flaticon.com

