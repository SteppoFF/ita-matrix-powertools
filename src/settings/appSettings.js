// General settings
const appSettings = {
  itaLanguage: "en",
  version: __VERSION__,
  retrycount: 1,
  laststatus: "",
  scriptrunning: 1,
  cabin: "Auto"
};

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
