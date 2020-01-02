import appSettings from "./appSettings";

const defaultSettings = {
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
  enableWheretocredit: 1 // enables Wheretocredit - click on booking class to open wheretocredit for this flight - valid: 0 / 1
};

export const registeredSettings = {};

/**
 * Registers a link
 * @param {string} name
 * @param {string} id
 * @param {{ name: string, value: string }[]} values
 * @param {string} defaultValue
 */
export function registerSetting(name, id, values, defaultValue) {
  registeredSettings[id] = { name, values };
  defaultSettings[id] = defaultValue;
}

export async function saveUserSettings(settings = defaultSettings) {
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

  /** @type typeof defaultSettings */
  const savedUserSettings = JSON.parse(gmSavedUserSettings);
  if (!savedUserSettings) return;

  Object.assign(defaultSettings, savedUserSettings);
}

export default defaultSettings;
