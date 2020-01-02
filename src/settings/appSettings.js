import { clearNotification } from "../utils";

// General settings
const appSettings = {
  scriptEngine:
    typeof GM === "undefined" || typeof GM.info === "undefined" ? 0 : 1, // 0 - console mode, 1 - tamper or grease mode
  itaLanguage: "en",
  version: __VERSION__,
  retrycount: 1,
  laststatus: "",
  scriptrunning: 1,
  cabin: "Auto"
};

export function reset() {
  // reset Notification due to pagechange
  clearNotification();

  // reset Editor Mode
  document.getElementById("mptStartparse").setAttribute("class", "invis");
  document.getElementById("mptStartparse").style.display = "none";
  appSettings.itaLanguage = "en";
  appSettings.retrycount = 1;
}

export function getForcedCabin() {
  switch (appSettings.cabin) {
    case "Y":
      return 0;
    case "Y+":
      return 1;
    case "C":
      return 2;
    case "F":
      return 3;
    default:
      return 0;
  }
}

export default appSettings;
