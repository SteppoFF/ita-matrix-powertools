# ita-matrix-powertools
Script for greasemonkey + ITA Matrix

[Main discussion thread at FlyerTalk Forums](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-userscript.html)

### Notice ###

```diff
- Double check your chosen flights before purchasing
- Some providers have limited support
```

### Posts you should read ###

1. [General statement regarding this script](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-united-userscript-4.html#post24394534)
2. [How to fix class names yourself](http://www.flyertalk.com/forum/24807572-post119.html)
3. [Problems and limitations regarding pricing itineraries](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-united-userscript-9.html#post24906119)

## Usage ##

Either add the script into your preferred script manager or copy the the RAW-Text into your debug console.
Using debug console, you may use the shortened minified version.
(Note: there is no need to reexecute the script on pagechange unless you reloaded the page)

You can also create a [Bookmarklet](https://support.mozilla.org/en-US/kb/bookmarklets-perform-common-web-page-tasks) by creating a Bookmark or Favorite in your browser with the following code as the URL:

```javascript:var scr=document.createElement('script');scr.src='https://rawgit.com/SteppoFF/ita-matrix-powertools/master/script_minified.js';document.body.appendChild(scr);```

![ITA Buy Bookmarklet example GIF](http://i.imgur.com/q5ttPrY.gif)

### Files ###

`ita-matrix-powertools.user.js` -- Main userscript, install into Greasemonkey/etc but also usable in debug console.

`script_minified.txt` --  Compact , pastable version of the script for pasting in the debug console.

### Latest major changes ###

**** Version 0.34 ****
2019-10-16 Edited by wylek (Fix farefreaks disable setting; add AA ES_ES; add Qantas deeplink)

##### Version 0.33 #####
2019-10-16 Edited by TechnoTourist (Air Canada promo code input)

##### Version 0.32 #####
2019-08-06 Edited by canadiancow (Pass fare basis to Air Canada)

##### Version 0.26 #####
2017-05-29 Edited by Dead-Flag (added Skyscanner)

##### Version 0.25 #####
2017-05-25 Edited by c0dr (Fixed DOM classes)

##### Version 0.24 #####
2017-04-09 Edited by mr-C (Added Finland edition for AirFrance, necessary for bookings originating in Lithuania / VNO)

##### Version 0.23 #####

2016-12-11 Edited by Steppo (Fixed Alitalia and added editions
                                added time zone resolving - only affecting links for American Airlines
                                added on the fly link updates for passengers/cabin - printLinksContainer()
                                added support for multiple onClick() events in link section)

##### Version 0.22 #####
2016-09-26 Edited by Steppo (Added American US/CA/GB currencies)

##### Version 0.21 #####
2016-09-18 Edited by Steppo (Removed Orbitz/Ebookers
                                fixed Air Canada
                                some Kayak tweaking)

##### Version 0.20 #####
2016-05-31 Edited by elduce (Added Monomdo & Kayak)

2016-06-05 Edited by Steppo (Disabled LAN, Removed invalid Ebookers targets, Regrouped links to Airline/OTA/Meta)

##### Version 0.18 #####
2016-05-01 Edited by Steppo (Renamed UserScript,
                                added cabin override,
                                added pax management -> use with caution!,
                                redesigned settings - added font size for links,
                                added editor mode,
                                reworked/adapted linking functions - added edition support,
                                tweaked extraction function - bugs removed/shortened/added plane type & fare carrier/improved currency detection,
                                added Amadeus realated functions,
                                added AAc1, BA, CZ, IB, LA, LH, LX, TK,
                                added advanced routing codes using FareFreaks,
                                added flight manager support of FareFreaks)

##### Version 0.17 #####
2016-04-11 Edited by Steppo (fixed Priceline)

2016-03-24 Edited by tomasdev (Fix Delta booking link like Google does)

##### Version 0.16 #####
2015-12-15 Edited by Steppo ( removed UA - Hipmunk,
                                use textNode for printing (external) messages)

2015-10-12 Edited by IAkH ( added wheretocredit.com calculator )

##### Version 0.15 #####
2015-09-30 Edited by IAkH ( added additional edition flyout menu,
                                added Ebookers,
                                added Etraveli )

##### Version 0.14 #####
2015-09-25 Edited by Steppo ( added American Airlines )

##### Version 0.13 #####
2015-06-15 Edited by Steppo ( fixed miles/passenger/price extraction,
                                 moved itin-data to global var "currentItin" -> capability to modify/reuse itin,
                                 rearranged config section,
                                 introduced wheretocredit.com,
                                 introduced background resolving of detailed distances using farefreaks.com based on data of OurAirports.com,
                                 tested on FF38, IE11, IE10 (emulated)
                                 )

##### Version 0.12 #####
2015-06-13 Edited by IAkH ( added CheapOair )

##### Version 0.11 #####
2015-04-19 Edited by Steppo (added SeatGuru,
                                added Planefinder,
                                moved translation to external var/function adding capability to add translations,
                                added possibility to print notifications,
                                added self-test to prevent crashing on class-changes,
                                set timeout of resultpage to 10s,
                                added powerfull selector-function to get desired td in itin => see findItinTarget,
                                moved exit in frames to top,
                                some cleanups,
                                moved older changelogitems to seperate file on GitHub - no one wants to read such lame stuff :-) )
