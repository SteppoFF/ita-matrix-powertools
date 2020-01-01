export default {
  timeformat: "12h", // replaces times on resultpage - valid: 12h / 24h
  language: "en", // replaces several items on resultpage - valid: en / de
  linkFontsize: 100, // fontsize of links - valid: 50-200
  showAllAirlines: 0, // shows all airline links regardless of search results

  // booleans to toggle specific settings:
  enableDeviders: 1, // Print deviders in links after group (airlines/otas/other stuff) - valid: 0 / 1
  enableInlineMode: 0, // enables inline mode - valid: 0 / 1
  enableEditormode: 0, // prevents the script from automatically parsing the itinerary - valid: 0 / 1
  enableIMGautoload: 0, // enables images to auto load - valid: 0 / 1
  enableFarerules: 1, // enables fare rule opening in new window - valid: 0 / 1
  enablePricebreakdown: 1, // enables price breakdown - valid: 0 / 1
  enablePlanefinder: 1, // enables Planefinder - click on flight numbers to open Planefinder for this flight - valid: 0 / 1
  enableSeatguru: 1, // enables Seatguru - click on plane type to open Seatguru for this flight - valid: 0 / 1
  enableWheretocredit: 1, // enables Wheretocredit - click on booking class to open wheretocredit for this flight - valid: 0 / 1

  // Default airline/OTA languages and locale/editions:
  acEdition: "us", // sets the local edition of AirCanada.com for itinerary pricing - valid: "us", "ca", "ar", "au", "ch", "cl", "cn", "co", "de", "dk", "es", "fr", "gb", "hk", "ie", "il", "it", "jp", "mx", "nl", "no", "pa", "pe", "se"
  aaEdition: "en_DE", // sets the local edition of AA-Europe/Asia for itinerary pricing - NO US available
  aac1Edition: "US", // sets the local edition of AA-C1 and UK
  afEdition: "US/en", // sets the local edition of Air France
  azEdition: "us_en", // sets the local edition of Alitalia
  baLanguage: "en", // sets the language of British Airways
  baEdition: "US", // sets the local edition of British Airways
  czEdition: "US-GB", // sets the local edition of China Southern
  dlEdition: "www_us", // sets the local edition of Delta
  ibEdition: "en-US", // sets the local edition of Iberia
  klEdition: "us_en", // sets the local edition of KLM
  laEdition: "en/us", // sets the local edition of LATAM
  lhEdition: "US-gb", // sets the local edition of Lufthansa
  lxEdition: "us_en", // sets the local edition of Swiss
  qfEdition: "EN_US", // sets the local edition of Qantas Airways

  // Default airline/OTA currencies:
  qfCurrency: "USD" // sets the Currency of Qantas
};
