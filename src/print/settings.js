import mptSettings from "../settings/appSettings";
import mptUserSettings, { saveUserSettings } from "../settings/userSettings";
import mtpPassengerConfig from "../settings/paxSettings";
import { toggleVis } from "../utils";

import { aaEditions } from "../links/airlines/aa";
import { aac1Editions } from "../links/airlines/aaC1";
import { afEditions } from "../links/airlines/af";
import { azEditions } from "../links/airlines/az";
import { baEditions } from "../links/airlines/ba";
import { czEditions } from "../links/airlines/cz";
import { dlEditions } from "../links/airlines/dl";
import { ibEditions } from "../links/airlines/ib";
import { klEditions } from "../links/airlines/kl";
import { laEditions } from "../links/airlines/la";
import { lhEditions } from "../links/airlines/lh";
import { lxEditions } from "../links/airlines/lx";
import { qfEditions, qfCurrencies } from "../links/airlines/qf";

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
    '<div id="mptenableDeviders">Enable deviders: <label style="cursor:pointer;">' +
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
    '<div style="text-align:center;font-weight:bold">**** Airline Locale / Edition: ****</div>';
  str += '<div style="margin:5px 0">';
  str +=
    '<div id="mptaaEdition" style="width:33%;float:left;">American (Europe/Asia/Pacific): <label style="cursor:pointer;">' +
    printSettingsvalue("aaEdition") +
    "</label></div>";
  str +=
    '<div id="mptaac1Edition" style="width:33%;float:left;">American (America/UK): <label style="cursor:pointer;">' +
    printSettingsvalue("aac1Edition") +
    "</label></div>";
  str +=
    '<div id="mptacEdition" style="width:33%;float:left;">Air Canada: <label style="cursor:pointer;">' +
    printSettingsvalue("acEdition") +
    "</label></div>";
  str +=
    '<div id="mptafEdition" style="width:33%;float:left;">Air France: <label style="cursor:pointer;">' +
    printSettingsvalue("afEdition") +
    "</label></div>";
  str +=
    '<div id="mptazEdition" style="width:33%;float:left;">Alitalia: <label style="cursor:pointer;">' +
    printSettingsvalue("azEdition") +
    "</label></div>";
  str +=
    '<div id="mptbaLanguage" style="width:33%;float:left;">British Airways (Language): <label style="cursor:pointer;">' +
    printSettingsvalue("baLanguage") +
    "</label></div>";
  str +=
    '<div id="mptbaEdition" style="width:33%;float:left;">British Airways (Locale): <label style="cursor:pointer;">' +
    printSettingsvalue("baEdition") +
    "</label></div>";
  str +=
    '<div id="mptczEdition" style="width:33%;float:left;">China Southern: <label style="cursor:pointer;">' +
    printSettingsvalue("czEdition") +
    "</label></div>";
  str +=
    '<div id="mptdlEdition" style="width:33%;float:left;">Delta: <label style="cursor:pointer;">' +
    printSettingsvalue("dlEdition") +
    "</label></div>";
  str +=
    '<div id="mptibEdition" style="width:33%;float:left;">Iberia: <label style="cursor:pointer;">' +
    printSettingsvalue("ibEdition") +
    "</label></div>";
  str +=
    '<div id="mptklEdition" style="width:33%;float:left;">KLM: <label style="cursor:pointer;">' +
    printSettingsvalue("klEdition") +
    "</label></div>";
  str +=
    '<div id="mptlaEdition" style="width:33%;float:left;">LATAM: <label style="cursor:pointer;">' +
    printSettingsvalue("laEdition") +
    "</label></div>";
  str +=
    '<div id="mptlhEdition" style="width:33%;float:left;">Lufthansa: <label style="cursor:pointer;">' +
    printSettingsvalue("lhEdition") +
    "</label></div>";
  str +=
    '<div id="mptlxEdition" style="width:33%;float:left;">Swiss: <label style="cursor:pointer;">' +
    printSettingsvalue("lxEdition") +
    "</label></div>";
  str +=
    '<div id="mptqfEdition" style="width:33%;float:left;">Qantas Airways: <label style="cursor:pointer;">' +
    printSettingsvalue("qfEdition") +
    "</label></div>";
  str += '<div style="clear:both"></div></div>';
  str +=
    '<div style="text-align:center;font-weight:bold">**** Airline Currency: ****</div>';
  str += '<div style="margin:5px 0">';
  str +=
    '<div id="mptqfCurrency" style="width:33%;float:left;">Qantas Airways: <label style="cursor:pointer;">' +
    printSettingsvalue("qfCurrency") +
    "</label></div>";
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
  document.getElementById("mptaaEdition").onclick = function() {
    toggleSettings("aaEdition");
  };
  document.getElementById("mptaac1Edition").onclick = function() {
    toggleSettings("aac1Edition");
  };
  document.getElementById("mptacEdition").onclick = function() {
    toggleSettings("acEdition");
  };
  document.getElementById("mptafEdition").onclick = function() {
    toggleSettings("afEdition");
  };
  document.getElementById("mptazEdition").onclick = function() {
    toggleSettings("azEdition");
  };
  document.getElementById("mptbaLanguage").onclick = function() {
    toggleSettings("baLanguage");
  };
  document.getElementById("mptbaEdition").onclick = function() {
    toggleSettings("baEdition");
  };
  document.getElementById("mptczEdition").onclick = function() {
    toggleSettings("czEdition");
  };
  document.getElementById("mptdlEdition").onclick = function() {
    toggleSettings("dlEdition");
  };
  document.getElementById("mptibEdition").onclick = function() {
    toggleSettings("ibEdition");
  };
  //document.getElementById('mptibCurrency').onclick=function(){toggleSettings("ibCurrency");};  // not supported
  document.getElementById("mptklEdition").onclick = function() {
    toggleSettings("klEdition");
  };
  document.getElementById("mptlaEdition").onclick = function() {
    toggleSettings("laEdition");
  };
  //document.getElementById('mptlaCurrency').onclick=function(){toggleSettings("laCurrency");}; // not supported
  document.getElementById("mptlhEdition").onclick = function() {
    toggleSettings("lhEdition");
  };
  document.getElementById("mptlxEdition").onclick = function() {
    toggleSettings("lxEdition");
  };
  document.getElementById("mptqfCurrency").onclick = function() {
    toggleSettings("qfCurrency");
  };
  document.getElementById("mptqfEdition").onclick = function() {
    toggleSettings("qfEdition");
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
    case "aaEdition":
      var pos = findPositionForValue(mptUserSettings.aaEdition, aaEditions);
      if (pos >= aaEditions.length - 1 || pos === -1) {
        mptUserSettings.aaEdition = aaEditions[0].value;
      } else {
        pos++;
        mptUserSettings.aaEdition = aaEditions[pos].value;
      }
      break;
    case "aac1Edition":
      var pos = findPositionForValue(mptUserSettings.aac1Edition, aac1Editions);
      if (pos >= aac1Editions.length - 1 || pos === -1) {
        mptUserSettings.aac1Edition = aac1Editions[0].value;
      } else {
        pos++;
        mptUserSettings.aac1Edition = aac1Editions[pos].value;
      }
      break;
    case "afEdition":
      var pos = findPositionForValue(mptUserSettings.afEdition, afEditions);
      if (pos >= afEditions.length - 1 || pos === -1) {
        mptUserSettings.afEdition = afEditions[0].value;
      } else {
        pos++;
        mptUserSettings.afEdition = afEditions[pos].value;
      }
      break;
    case "azEdition":
      var pos = findPositionForValue(mptUserSettings.azEdition, azEditions);
      if (pos >= azEditions.length - 1 || pos === -1) {
        mptUserSettings.azEdition = azEditions[0].value;
      } else {
        pos++;
        mptUserSettings.azEdition = azEditions[pos].value;
      }
      break;
    case "baEdition":
      var pos = findPositionForValue(mptUserSettings.baEdition, baEditions);
      if (pos >= baEditions.length - 1 || pos === -1) {
        mptUserSettings.baEdition = baEditions[0].value;
      } else {
        pos++;
        mptUserSettings.baEdition = baEditions[pos].value;
      }
      break;
    case "czEdition":
      var pos = findPositionForValue(mptUserSettings.czEdition, czEditions);
      if (pos >= czEditions.length - 1 || pos === -1) {
        mptUserSettings.czEdition = czEditions[0].value;
      } else {
        pos++;
        mptUserSettings.czEdition = czEditions[pos].value;
      }
      break;
    case "dlEdition":
      var pos = findPositionForValue(mptUserSettings.dlEdition, dlEditions);
      if (pos >= dlEditions.length - 1 || pos === -1) {
        mptUserSettings.dlEdition = dlEditions[0].value;
      } else {
        pos++;
        mptUserSettings.dlEdition = dlEditions[pos].value;
      }
      break;
    case "ibEdition":
      var pos = findPositionForValue(mptUserSettings.ibEdition, ibEditions);
      if (pos >= ibEditions.length - 1 || pos === -1) {
        mptUserSettings.ibEdition = ibEditions[0].value;
      } else {
        pos++;
        mptUserSettings.ibEdition = ibEditions[pos].value;
      }
      break;
    case "klEdition":
      var pos = findPositionForValue(mptUserSettings.klEdition, klEditions);
      if (pos >= klEditions.length - 1 || pos === -1) {
        mptUserSettings.klEdition = klEditions[0].value;
      } else {
        pos++;
        mptUserSettings.klEdition = klEditions[pos].value;
      }
      break;
    case "laEdition":
      var pos = findPositionForValue(mptUserSettings.laEdition, laEditions);
      if (pos >= laEditions.length - 1 || pos === -1) {
        mptUserSettings.laEdition = laEditions[0].value;
      } else {
        pos++;
        mptUserSettings.laEdition = laEditions[pos].value;
      }
      break;
    case "lhEdition":
      var pos = findPositionForValue(mptUserSettings.lhEdition, lhEditions);
      if (pos >= lhEditions.length - 1 || pos === -1) {
        mptUserSettings.lhEdition = lhEditions[0].value;
      } else {
        pos++;
        mptUserSettings.lhEdition = lhEditions[pos].value;
      }
      break;
    case "lxEdition":
      var pos = findPositionForValue(mptUserSettings.lxEdition, lxEditions);
      if (pos >= lxEditions.length - 1 || pos === -1) {
        mptUserSettings.lxEdition = lxEditions[0].value;
      } else {
        pos++;
        mptUserSettings.lxEdition = lxEditions[pos].value;
      }
      break;
    case "qfEdition":
      var pos = findPositionForValue(mptUserSettings.qfEdition, qfEditions);
      if (pos >= qfEditions.length - 1 || pos === -1) {
        mptUserSettings.qfEdition = qfEditions[0].value;
      } else {
        pos++;
        mptUserSettings.qfEdition = qfEditions[pos].value;
      }
      break;
    case "qfCurrency":
      var pos = findPositionForValue(mptUserSettings.qfCurrency, qfCurrencies);
      if (pos >= qfCurrencies.length - 1 || pos === -1) {
        mptUserSettings.qfCurrency = qfCurrencies[0].value;
      } else {
        pos++;
        mptUserSettings.qfCurrency = qfCurrencies[pos].value;
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
  var ret = "";
  switch (target) {
    case "timeformat":
      ret = mptUserSettings.timeformat;
      break;
    case "language":
      ret = mptUserSettings.language;
      break;
    case "linkFontsize":
      ret = mptUserSettings.linkFontsize.toString();
      break;
    case "acEdition":
      ret = mptUserSettings.acEdition;
      break;
    case "aaEdition":
      ret = findNameForValue(mptUserSettings.aaEdition, aaEditions);
      break;
    case "aac1Edition":
      ret = findNameForValue(mptUserSettings.aac1Edition, aac1Editions);
      break;
    case "afEdition":
      ret = findNameForValue(mptUserSettings.afEdition, afEditions);
      break;
    case "azEdition":
      ret = findNameForValue(mptUserSettings.azEdition, azEditions);
      break;
    case "baEdition":
      ret = findNameForValue(mptUserSettings.baEdition, baEditions);
      break;
    case "czEdition":
      ret = findNameForValue(mptUserSettings.czEdition, czEditions);
      break;
    case "dlEdition":
      ret = findNameForValue(mptUserSettings.dlEdition, dlEditions);
      break;
    case "ibEdition":
      ret = findNameForValue(mptUserSettings.ibEdition, ibEditions);
      break;
    case "klEdition":
      ret = findNameForValue(mptUserSettings.klEdition, klEditions);
      break;
    case "laEdition":
      ret = findNameForValue(mptUserSettings.laEdition, laEditions);
      break;
    case "lhEdition":
      ret = findNameForValue(mptUserSettings.lhEdition, lhEditions);
      break;
    case "lxEdition":
      ret = findNameForValue(mptUserSettings.lxEdition, lxEditions);
      break;
    case "qfEdition":
      ret = findNameForValue(mptUserSettings.qfEdition, qfEditions);
      break;
    case "qfCurrency":
      ret = findNameForValue(mptUserSettings.qfCurrency, qfCurrencies);
      break;
    default:
      ret = boolToEnabled(mptUserSettings[target]);
  }
  return ret;
}

function findNameForValue(needle, haystack) {
  var ret = "Unknown";
  for (var i in haystack) {
    if (haystack[i].value == needle) {
      ret = haystack[i].name;
      break;
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
