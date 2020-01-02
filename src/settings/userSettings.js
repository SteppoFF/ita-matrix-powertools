import appSettings from "./appSettings";

const userSettings = {
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

export async function saveUserSettings(settings = userSettings) {
  switch (appSettings.scriptEngine) {
    case 0:
      localStorage.setItem("mptUserSettings", JSON.stringify(settings));
      break;
    case 1:
      await GM.setValue("mptUserSettings", JSON.stringify(settings));
      break;
  }
}

export async function loadUserSettings() {
  let gmSavedUserSettings;
  switch (appSettings.scriptEngine) {
    case 0:
      gmSavedUserSettings = localStorage.getItem("mptUserSettings");
      break;
    case 1:
      gmSavedUserSettings = await GM.getValue("mptUserSettings");
      break;
  }
  console.log("mptSavedUserSettings: " + gmSavedUserSettings);
  if (!gmSavedUserSettings || typeof gmSavedUserSettings !== "string") return;

  /** @type typeof userSettings */
  const savedUserSettings = JSON.parse(gmSavedUserSettings);
  if (!savedUserSettings) return;

  userSettings.timeformat =
    savedUserSettings.timeformat === undefined
      ? userSettings.timeformat
      : savedUserSettings.timeformat;
  userSettings.language =
    savedUserSettings.language === undefined
      ? userSettings.language
      : savedUserSettings.language;
  userSettings.enableDeviders =
    savedUserSettings.enableDeviders === undefined
      ? userSettings.enableDeviders
      : savedUserSettings.enableDeviders;
  userSettings.enableInlineMode =
    savedUserSettings.enableInlineMode === undefined
      ? userSettings.enableInlineMode
      : savedUserSettings.enableInlineMode;
  userSettings.enableEditormode =
    savedUserSettings.enableEditormode === undefined
      ? userSettings.enableEditormode
      : savedUserSettings.enableEditormode;
  userSettings.enableIMGautoload =
    savedUserSettings.enableIMGautoload === undefined
      ? userSettings.enableIMGautoload
      : savedUserSettings.enableIMGautoload;
  userSettings.enableFarerules =
    savedUserSettings.enableFarerules === undefined
      ? userSettings.enableFarerules
      : savedUserSettings.enableFarerules;
  userSettings.enablePricebreakdown =
    savedUserSettings.enablePricebreakdown === undefined
      ? userSettings.enablePricebreakdown
      : savedUserSettings.enablePricebreakdown;
  userSettings.linkFontsize =
    savedUserSettings.linkFontsize === undefined
      ? userSettings.linkFontsize
      : savedUserSettings.linkFontsize;
  userSettings.showAllAirlines =
    savedUserSettings.showAllAirlines === undefined
      ? userSettings.showAllAirlines
      : savedUserSettings.showAllAirlines;
  userSettings.enablePlanefinder =
    savedUserSettings.enablePlanefinder === undefined
      ? userSettings.enablePlanefinder
      : savedUserSettings.enablePlanefinder;
  userSettings.enableSeatguru =
    savedUserSettings.enableSeatguru === undefined
      ? userSettings.enableSeatguru
      : savedUserSettings.enableSeatguru;
  userSettings.enableWheretocredit =
    savedUserSettings.enableWheretocredit === undefined
      ? userSettings.enableWheretocredit
      : savedUserSettings.enableWheretocredit;
  userSettings.acEdition =
    savedUserSettings.acEdition === undefined
      ? userSettings.acEdition
      : savedUserSettings.acEdition;
  userSettings.aaEdition =
    savedUserSettings.aaEdition === undefined
      ? userSettings.aaEdition
      : savedUserSettings.aaEdition;
  userSettings.aac1Edition =
    savedUserSettings.aac1Edition === undefined
      ? userSettings.aac1Edition
      : savedUserSettings.aac1Edition;
  userSettings.afEdition =
    savedUserSettings.afEdition === undefined
      ? userSettings.afEdition
      : savedUserSettings.afEdition;
  userSettings.azEdition =
    savedUserSettings.azEdition === undefined
      ? userSettings.azEdition
      : savedUserSettings.azEdition;
  userSettings.baLanguage =
    savedUserSettings.baLanguage === undefined
      ? userSettings.baLanguage
      : savedUserSettings.baLanguage;
  userSettings.baEdition =
    savedUserSettings.baEdition === undefined
      ? userSettings.baEdition
      : savedUserSettings.baEdition;
  userSettings.czEdition =
    savedUserSettings.czEdition === undefined
      ? userSettings.czEdition
      : savedUserSettings.czEdition;
  userSettings.dlEdition =
    savedUserSettings.dlEdition === undefined
      ? userSettings.dlEdition
      : savedUserSettings.dlEdition;
  userSettings.ibCurrency =
    savedUserSettings.ibCurrency === undefined
      ? userSettings.ibCurrency
      : savedUserSettings.ibCurrency;
  userSettings.ibEdition =
    savedUserSettings.ibEdition === undefined
      ? userSettings.ibEdition
      : savedUserSettings.ibEdition;
  userSettings.klEdition =
    savedUserSettings.klEdition === undefined
      ? userSettings.klEdition
      : savedUserSettings.klEdition;
  userSettings.laEdition =
    savedUserSettings.laEdition === undefined
      ? userSettings.laEdition
      : savedUserSettings.laEdition;
  userSettings.laCurrency =
    savedUserSettings.laCurrency === undefined
      ? userSettings.laCurrency
      : savedUserSettings.laCurrency;
  userSettings.lhEdition =
    savedUserSettings.lhEdition === undefined
      ? userSettings.lhEdition
      : savedUserSettings.lhEdition;
  userSettings.lxEdition =
    savedUserSettings.lxEdition === undefined
      ? userSettings.lxEdition
      : savedUserSettings.lxEdition;
  userSettings.qfCurrency =
    savedUserSettings.qfCurrency === undefined
      ? userSettings.qfCurrency
      : savedUserSettings.qfCurrency;
  userSettings.qfEdition =
    savedUserSettings.qfEdition === undefined
      ? userSettings.qfEdition
      : savedUserSettings.qfEdition;
}

export default userSettings;
