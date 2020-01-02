import mptSettings from "../settings/appSettings";
import mptUserSettings, {
  registeredSettings,
  saveUserSettings
} from "../settings/userSettings";
import mtpPassengerConfig from "../settings/paxSettings";
import { toggleVis } from "../utils";

import { render } from ".";
import { printLinksContainer } from "./links";

/**************************************** Settings Stuff *****************************************/
export function createUsersettings() {
  var str = "";
  var settingscontainer = document.createElement("div");
  settingscontainer.setAttribute("id", "mptSettingsContainer");
  settingscontainer.setAttribute("style", "border-bottom: 1px dashed grey;");
  settingscontainer.innerHTML =
    '<div style="display:inline-block;float:left;cursor:pointer;" id="passengerVisToggler">Passengers (<label id="mtpPaxCount">1a</label>)</div><div id="mptStartparse" class="invis" style="margin-left:20px;display:none;cursor:pointer">Editor-Mode:Parse!</div><div id="mtpNotification" style="margin-left:50px;display:inline-block;"></div><div style="display:inline-block;float:right;"><div id="settingsVisToggler" style="display:inline-block;cursor:pointer;">Settings</div> (v' +
    mptSettings.version +
    ') <div id="mptCabintoggler" style="display:inline-block;">(Cabin: <label id="mptCabinMode" style="width:30px;text-align:center;cursor:pointer;display:inline-block">Auto</label>)</div></div><div id="mptSettings" class="invis" style="display:none;border-top: 1px dotted grey;"></div><div id="mptPassengers" class="invis" style="display:none;border-top: 1px dotted grey;"></div>';
  var target = document.getElementById("contentwrapper");
  target.parentElement.insertBefore(settingscontainer, target);
  document.getElementById("settingsVisToggler").onclick = function() {
    toggleVis(document.getElementById("mptSettings"));
  };
  document.getElementById("passengerVisToggler").onclick = function() {
    toggleVis(document.getElementById("mptPassengers"));
  };

  // Build settings
  target = document.getElementById("mptSettings");
  str =
    '<div id="mptrestoredefault" style="text-align:right;font-weight:bold;text-decoration:underline;">Restore Defaults</div>';
  str +=
    '<div style="text-align:center;font-weight:bold">**** Display Settings: ****</div>';
  str += '<div style="margin:5px 0;"><div style="float:left;width:25%">';
  str +=
    '<div id="mpttimeformat">Time Format: <label style="cursor:pointer;">' +
    printSettingsvalue("timeformat") +
    "</label></div>";
  str +=
    '<div id="mptlanguage">Language: <label style="cursor:pointer;">' +
    printSettingsvalue("language") +
    "</label></div>";
  str += '</div><div style="float:left;width:25%">';
  str +=
    '<div id="mptenableDeviders">Enable dividers: <label style="cursor:pointer;">' +
    printSettingsvalue("enableDeviders") +
    "</label></div>";
  str +=
    '<div id="mptenableInlineMode">Inline Mode: <label style="cursor:pointer;">' +
    printSettingsvalue("enableInlineMode") +
    "</label></div>";
  str += '</div><div style="float:left;width:25%">';
  str +=
    '<div id="mptenableFarerules">Open fare-rules in new window: <label style="cursor:pointer;">' +
    printSettingsvalue("enableFarerules") +
    "</label></div>";
  str +=
    '<div id="mptenablePricebreakdown">Price breakdown: <label style="cursor:pointer;">' +
    printSettingsvalue("enablePricebreakdown") +
    "</label></div>";
  str += '</div><div style="float:left;width:25%">';
  str +=
    '<div id="mptlinkFontsize">Link font size: <label style="cursor:pointer;">' +
    printSettingsvalue("linkFontsize") +
    "</label>%</div>";
  str +=
    '<div id="mptshowAllAirlines">All airlines: <label style="cursor:pointer;">' +
    printSettingsvalue("showAllAirlines") +
    "</label></div>";
  str += '</div><div style="clear:both"></div></div>';
  str +=
    '<div style="text-align:center;font-weight:bold">**** Feature Settings: ****</div>';
  str += '<div style="margin:5px 0"><div style="float:left;width:25%">';
  str +=
    '<div id="mptenableEditormode">Editor mode: <label style="cursor:pointer;">' +
    printSettingsvalue("enableEditormode") +
    "</label></div>";
  str += '</div><div style="float:left;width:33%">';
  str += '</div><div style="float:left;width:33%">';
  str +=
    '<div id="mptenableIMGautoload">Images autoload: <label style="cursor:pointer;">' +
    printSettingsvalue("enableIMGautoload") +
    "</label></div>";
  str += '</div><div style="float:left;width:33%">';
  str +=
    '<div id="mptenableWheretocredit">Enable WhereToCredit: <label style="cursor:pointer;">' +
    printSettingsvalue("enableWheretocredit") +
    "</label></div>";
  str +=
    '<div id="mptenablePlanefinder">Enable Planefinder: <label style="cursor:pointer;">' +
    printSettingsvalue("enablePlanefinder") +
    "</label></div>";
  str +=
    '<div id="mptenableSeatguru">Enable Seatguru: <label style="cursor:pointer;">' +
    printSettingsvalue("enableSeatguru") +
    "</label></div>";
  str += '</div><div style="clear:both"></div></div>';
  str +=
    '<div style="text-align:center;font-weight:bold">**** Link Settings: ****</div>';
  str += '<div style="margin:5px 0">';

  Object.keys(registeredSettings).forEach(setting => {
    str += `<div id="mpt${setting}" style="width:33%;float:left;">${
      registeredSettings[setting].name
    }: <label style="cursor:pointer;">${printSettingsvalue(
      setting
    )}</label></div>`;
  });
  str += '<div style="clear:both"></div></div>';
  str +=
    '<div style="text-align:center;font-weight:bold"><label id="configcloser" style="cursor:pointer;text-decoration:underline;">Close</label><div>';
  target.innerHTML = str;

  // these onClick event handlers need only be added once:
  document.getElementById("mptrestoredefault").onclick = function() {
    restoreDefaultSettings();
  };
  document.getElementById("mpttimeformat").onclick = function() {
    toggleSettings("timeformat");
  };
  document.getElementById("mptlanguage").onclick = function() {
    toggleSettings("language");
  };
  document.getElementById("mptenableDeviders").onclick = function() {
    toggleSettings("enableDeviders");
  };
  document.getElementById("mptenableInlineMode").onclick = function() {
    toggleSettings("enableInlineMode");
  };
  document.getElementById("mptenableEditormode").onclick = function() {
    toggleSettings("enableEditormode");
  };
  document.getElementById("mptenableIMGautoload").onclick = function() {
    toggleSettings("enableIMGautoload");
  };
  document.getElementById("mptenableFarerules").onclick = function() {
    toggleSettings("enableFarerules");
  };
  document.getElementById("mptenablePricebreakdown").onclick = function() {
    toggleSettings("enablePricebreakdown");
  };
  document.getElementById("mptlinkFontsize").onclick = function() {
    toggleSettings("linkFontsize");
  };
  document.getElementById("mptshowAllAirlines").onclick = function() {
    toggleSettings("showAllAirlines");
  };
  document.getElementById("mptenablePlanefinder").onclick = function() {
    toggleSettings("enablePlanefinder");
  };
  document.getElementById("mptenableSeatguru").onclick = function() {
    toggleSettings("enableSeatguru");
  };
  document.getElementById("mptenableWheretocredit").onclick = function() {
    toggleSettings("enableWheretocredit");
  };
  document.getElementById("mptCabintoggler").onclick = function() {
    toggleSettings("cabin");
  };
  document.getElementById("configcloser").onclick = function() {
    toggleVis(document.getElementById("mptSettings"));
  };
  document.getElementById("mptStartparse").onclick = function() {
    setTimeout(function() {
      render();
    }, 50);
  };

  Object.keys(registeredSettings).forEach(setting => {
    document.getElementById("mpt" + setting).onclick = function() {
      toggleSettings(setting);
    };
  });

  // Build passengers
  target = document.getElementById("mptPassengers");
  str = '<div style="float:left;width:25%">';
  str +=
    '<div style="margin:2px 0"><label style="width:100px;display:inline-block">Adults: </label> <select name="numAdults" id="numAdults" style="width:50px">';
  for (var i = 1; i <= 9; i++) {
    str += "<option>" + i + "</option>";
  }
  str += "</select></div>";
  str +=
    '<div style="margin:2px 0"><label style="width:100px;display:inline-block">Infants (Lap): </label> <select name="numInfantsLap" id="numInfantsLap" style="width:50px">';
  for (var i = 0; i <= 9; i++) {
    str += "<option>" + i + "</option>";
  }
  str += "</select></div>";
  str +=
    '<div style="margin:2px 0"><label style="width:100px;display:inline-block">Infants (Seat): </label> <select name="numInfantsSeat" id="numInfantsSeat" style="width:50px">';
  for (var i = 0; i <= 9; i++) {
    str += "<option>" + i + "</option>";
  }
  str += "</select></div>";
  str += '</div><div style="float:left;width:25%">';
  for (var k = 1; k <= 3; k++) {
    str +=
      '<div style="margin:2px 0"><label style="width:100px;display:inline-block">Child ' +
      k +
      ' - Age: </label> <select name="child' +
      k +
      'age" id="child' +
      k +
      'age" style="width:50px">';
    str += '<option value="-1">-</option>';
    for (var i = 2; i <= 17; i++) {
      str += '<option value="' + i + '">' + i + "</option>";
    }
    str += "</select></div>";
  }
  str += '</div><div style="float:left;width:25%">';
  for (var k = 4; k <= 6; k++) {
    str +=
      '<div style="margin:2px 0"><label style="width:100px;display:inline-block">Child ' +
      k +
      ' - Age: </label> <select name="child' +
      k +
      'age" id="child' +
      k +
      'age" style="width:50px">';
    str += '<option value="-1">-</option>';
    for (var i = 2; i <= 17; i++) {
      str += '<option value="' + i + '">' + i + "</option>";
    }
    str += "</select></div>";
  }
  str += '</div><div style="float:left;width:25%">';
  for (var k = 7; k <= 8; k++) {
    str +=
      '<div style="margin:2px 0"><label style="width:100px;display:inline-block">Child ' +
      k +
      ' - Age: </label> <select name="child' +
      k +
      'age" id="child' +
      k +
      'age" style="width:50px">';
    str += '<option value="-1">-</option>';
    for (var i = 2; i <= 17; i++) {
      str += '<option value="' + i + '">' + i + "</option>";
    }
    str += "</select></div>";
  }
  str +=
    '<div style="width:150px;margin:2px 0"><div id="mtpConfirmPax" style="float:left;width:50%;text-align:center;cursor:pointer;font-weight:bold">Confirm</div><div id="mtpCancelPax" style="float:left;width:50%;text-align:center;cursor:pointer;font-weight:bold">Cancel</div></div>';
  str += '</div><div style="clear:both;"></div>';
  target.innerHTML = str;
  document.getElementById("mtpCancelPax").onclick = function() {
    toggleVis(document.getElementById("mptPassengers"));
  };
  document.getElementById("mtpConfirmPax").onclick = function() {
    processPassengers();
  };
}

function restoreDefaultSettings() {
  // this function will remove any saved settings and restore default values
  if (
    window.confirm(
      "Are you sure you want to reset any saved settings to the default values? The page will automatically reload to complete the reset."
    )
  ) {
    (async () => {
      if (typeof GM === "undefined" || typeof GM.info != "undefined") {
        await saveUserSettings(null);
      }
      // Reload the current page:
      window.location.reload();
    })(); // end async for GM4
  }
}

function toggleSettings(target) {
  console.log("toggleSettings called. target=" + target);

  if (registeredSettings[target] && registeredSettings[target].values) {
    const pos = findPositionForValue(
      mptUserSettings[target],
      registeredSettings[target].values
    );
    if (pos >= registeredSettings[target].values.length - 1 || pos === -1) {
      mptUserSettings[target] = registeredSettings[target].values[0].value;
    } else {
      mptUserSettings[target] =
        registeredSettings[target].values[pos + 1].value;
    }
  } else {
    switch (target) {
      case "timeformat":
        if (mptUserSettings.timeformat == "12h") {
          mptUserSettings.timeformat = "24h";
        } else {
          mptUserSettings.timeformat = "12h";
        }
        break;
      case "language":
        if (mptUserSettings.language == "de") {
          mptUserSettings.language = "en";
        } else {
          mptUserSettings.language = "de";
        }
        break;
      case "linkFontsize":
        if (
          mptUserSettings.linkFontsize <= 190 &&
          mptUserSettings.linkFontsize >= 50
        ) {
          mptUserSettings.linkFontsize += 10;
        } else {
          mptUserSettings.linkFontsize = 50;
        }
        break;
      case "cabin":
        if (mptSettings.cabin === "Auto") {
          mptSettings.cabin = "Y";
        } else if (mptSettings.cabin === "Y") {
          mptSettings.cabin = "Y+";
        } else if (mptSettings.cabin === "Y+") {
          mptSettings.cabin = "C";
        } else if (mptSettings.cabin === "C") {
          mptSettings.cabin = "F";
        } else if (mptSettings.cabin === "F") {
          mptSettings.cabin = "Auto";
        }
        document.getElementById("mptCabinMode").innerHTML = mptSettings.cabin;

        // refresh links
        printLinksContainer();
        break;
      default:
        if (mptUserSettings[target] == 1) {
          mptUserSettings[target] = 0;
        } else {
          mptUserSettings[target] = 1;
        }
    }
  }
  document.getElementById(
    "mpt" + target
  ).firstElementChild.innerHTML = printSettingsvalue(target);
  saveUserSettings();
}

function processPassengers() {
  var paxText = "";
  var e = document.getElementById("numAdults");
  mtpPassengerConfig.adults = Number(e.options[e.selectedIndex].value);
  e = document.getElementById("numInfantsLap");
  mtpPassengerConfig.infantsLap = Number(e.options[e.selectedIndex].value);
  e = document.getElementById("numInfantsSeat");
  mtpPassengerConfig.infantsSeat = Number(e.options[e.selectedIndex].value);
  mtpPassengerConfig.cAges = new Array();
  for (var i = 1; i <= 8; i++) {
    processChild("child" + i + "age");
  }
  paxText =
    mtpPassengerConfig.adults +
    "a" +
    (mtpPassengerConfig.cAges.length > 0
      ? " " + mtpPassengerConfig.cAges.length + "c"
      : "") +
    (mtpPassengerConfig.infantsLap + mtpPassengerConfig.infantsSeat > 0
      ? " " +
        (mtpPassengerConfig.infantsLap + mtpPassengerConfig.infantsSeat) +
        "i"
      : "");
  document.getElementById("mtpPaxCount").innerHTML = paxText;
  toggleVis(document.getElementById("mptPassengers"));
  // reload links
  printLinksContainer();
}

function processChild(target) {
  var e = document.getElementById(target);
  var tmp = 0;
  tmp = Number(e.options[e.selectedIndex].value);
  if (tmp >= 2) {
    mtpPassengerConfig.cAges.push(tmp);
  }
}

function printSettingsvalue(target) {
  if (registeredSettings[target]) {
    return findNameForValue(
      mptUserSettings[target],
      registeredSettings[target].values
    );
  }

  switch (target) {
    case "timeformat":
      return mptUserSettings.timeformat;
    case "language":
      return mptUserSettings.language;
    case "linkFontsize":
      return mptUserSettings.linkFontsize.toString();
    default:
      return boolToEnabled(mptUserSettings[target]);
  }
}

function findNameForValue(needle, haystack) {
  var ret = "Unknown";
  for (var i in haystack) {
    if (haystack[i].value == needle) {
      return haystack[i].name;
    }
  }
  return ret;
}

function findPositionForValue(needle, haystack) {
  return haystack.findIndex(o => o.value == needle);
}

function boolToEnabled(value) {
  if (value == 1) {
    return "enabled";
  } else {
    return "disabled";
  }
}
