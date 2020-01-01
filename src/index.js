import mptSettings from "./settings/appSettings";
import mptUserSettings from "./settings/userSettings";
import classSettings from "./settings/itaSettings";
import translations from "./settings/translations";
import mtpPassengerConfig from "./settings/paxSettings";
import { currentItin, readItinerary } from "./parse/itin";
import { printNotification, findtarget, findtargets, hasClass } from "./utils";
import { printLinksContainer, printItemInline } from "./print/links";
import { aaEditions } from "./links/airlines/aa";
import { aac1Editions } from "./links/airlines/aaC1";
import { afEditions } from "./links/airlines/af";
import { azEditions } from "./links/airlines/az";
import { baEditions } from "./links/airlines/ba";
import { czEditions } from "./links/airlines/cz";
import { dlEditions } from "./links/airlines/dl";
import { ibEditions } from "./links/airlines/ib";
import { klEditions } from "./links/airlines/kl";
import { laEditions } from "./links/airlines/la";
import { lhEditions } from "./links/airlines/lh";
import { lxEditions } from "./links/airlines/lx";
import { qfEditions, qfCurrencies } from "./links/airlines/qf";

/**************************************** Start Script *****************************************/

// *** DO NOT CHANGE BELOW THIS LINE***/

function startScript() {
  if (window.location.href !== mptSettings.laststatus) {
    setTimeout(function() {
      getPageLang();
    }, 100);
    mptSettings.laststatus = window.location.href;
  }
  if (mptSettings.scriptrunning === 1) {
    setTimeout(function() {
      startScript();
    }, 500);
  }
}

/**************************************** Settings Stuff *****************************************/
function createUsersettings() {
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
    document.getElementById("mptStartparse").style.display = "none";
    setTimeout(function() {
      fePS();
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

// async retrieval of saved user settings for user script managers (GM4+/TM):
(async () => {
  if (typeof GM === "undefined" || typeof GM.info === "undefined") {
    mptSettings.scriptEngine = 0; // console mode
    // now render the settings section:
    createUsersettings();
  } else {
    mptSettings.scriptEngine = 1; // tamper or grease mode
    var gmSavedUserSettings = await GM.getValue("mptUserSettings", "");
    console.log("mptSavedUserSettings: " + gmSavedUserSettings);
    if (gmSavedUserSettings) {
      /** @type typeof mptUserSettings */
      const mptSavedUserSettings = JSON.parse(gmSavedUserSettings);
      mptUserSettings.timeformat =
        mptSavedUserSettings.timeformat === undefined
          ? mptUserSettings.timeformat
          : mptSavedUserSettings.timeformat;
      mptUserSettings.language =
        mptSavedUserSettings.language === undefined
          ? mptUserSettings.language
          : mptSavedUserSettings.language;
      mptUserSettings.enableDeviders =
        mptSavedUserSettings.enableDeviders === undefined
          ? mptUserSettings.enableDeviders
          : mptSavedUserSettings.enableDeviders;
      mptUserSettings.enableInlineMode =
        mptSavedUserSettings.enableInlineMode === undefined
          ? mptUserSettings.enableInlineMode
          : mptSavedUserSettings.enableInlineMode;
      mptUserSettings.enableEditormode =
        mptSavedUserSettings.enableEditormode === undefined
          ? mptUserSettings.enableEditormode
          : mptSavedUserSettings.enableEditormode;
      mptUserSettings.enableIMGautoload =
        mptSavedUserSettings.enableIMGautoload === undefined
          ? mptUserSettings.enableIMGautoload
          : mptSavedUserSettings.enableIMGautoload;
      mptUserSettings.enableFarerules =
        mptSavedUserSettings.enableFarerules === undefined
          ? mptUserSettings.enableFarerules
          : mptSavedUserSettings.enableFarerules;
      mptUserSettings.enablePricebreakdown =
        mptSavedUserSettings.enablePricebreakdown === undefined
          ? mptUserSettings.enablePricebreakdown
          : mptSavedUserSettings.enablePricebreakdown;
      mptUserSettings.linkFontsize =
        mptSavedUserSettings.linkFontsize === undefined
          ? mptUserSettings.linkFontsize
          : mptSavedUserSettings.linkFontsize;
      mptUserSettings.showAllAirlines =
        mptSavedUserSettings.showAllAirlines === undefined
          ? mptUserSettings.showAllAirlines
          : mptSavedUserSettings.showAllAirlines;
      mptUserSettings.enablePlanefinder =
        mptSavedUserSettings.enablePlanefinder === undefined
          ? mptUserSettings.enablePlanefinder
          : mptSavedUserSettings.enablePlanefinder;
      mptUserSettings.enableSeatguru =
        mptSavedUserSettings.enableSeatguru === undefined
          ? mptUserSettings.enableSeatguru
          : mptSavedUserSettings.enableSeatguru;
      mptUserSettings.enableWheretocredit =
        mptSavedUserSettings.enableWheretocredit === undefined
          ? mptUserSettings.enableWheretocredit
          : mptSavedUserSettings.enableWheretocredit;
      mptUserSettings.acEdition =
        mptSavedUserSettings.acEdition === undefined
          ? mptUserSettings.acEdition
          : mptSavedUserSettings.acEdition;
      mptUserSettings.aaEdition =
        mptSavedUserSettings.aaEdition === undefined
          ? mptUserSettings.aaEdition
          : mptSavedUserSettings.aaEdition;
      mptUserSettings.aac1Edition =
        mptSavedUserSettings.aac1Edition === undefined
          ? mptUserSettings.aac1Edition
          : mptSavedUserSettings.aac1Edition;
      mptUserSettings.afEdition =
        mptSavedUserSettings.afEdition === undefined
          ? mptUserSettings.afEdition
          : mptSavedUserSettings.afEdition;
      mptUserSettings.azEdition =
        mptSavedUserSettings.azEdition === undefined
          ? mptUserSettings.azEdition
          : mptSavedUserSettings.azEdition;
      mptUserSettings.baLanguage =
        mptSavedUserSettings.baLanguage === undefined
          ? mptUserSettings.baLanguage
          : mptSavedUserSettings.baLanguage;
      mptUserSettings.baEdition =
        mptSavedUserSettings.baEdition === undefined
          ? mptUserSettings.baEdition
          : mptSavedUserSettings.baEdition;
      mptUserSettings.czEdition =
        mptSavedUserSettings.czEdition === undefined
          ? mptUserSettings.czEdition
          : mptSavedUserSettings.czEdition;
      mptUserSettings.dlEdition =
        mptSavedUserSettings.dlEdition === undefined
          ? mptUserSettings.dlEdition
          : mptSavedUserSettings.dlEdition;
      mptUserSettings.ibCurrency =
        mptSavedUserSettings.ibCurrency === undefined
          ? mptUserSettings.ibCurrency
          : mptSavedUserSettings.ibCurrency;
      mptUserSettings.ibEdition =
        mptSavedUserSettings.ibEdition === undefined
          ? mptUserSettings.ibEdition
          : mptSavedUserSettings.ibEdition;
      mptUserSettings.klEdition =
        mptSavedUserSettings.klEdition === undefined
          ? mptUserSettings.klEdition
          : mptSavedUserSettings.klEdition;
      mptUserSettings.laEdition =
        mptSavedUserSettings.laEdition === undefined
          ? mptUserSettings.laEdition
          : mptSavedUserSettings.laEdition;
      mptUserSettings.laCurrency =
        mptSavedUserSettings.laCurrency === undefined
          ? mptUserSettings.laCurrency
          : mptSavedUserSettings.laCurrency;
      mptUserSettings.lhEdition =
        mptSavedUserSettings.lhEdition === undefined
          ? mptUserSettings.lhEdition
          : mptSavedUserSettings.lhEdition;
      mptUserSettings.lxEdition =
        mptSavedUserSettings.lxEdition === undefined
          ? mptUserSettings.lxEdition
          : mptSavedUserSettings.lxEdition;
      mptUserSettings.qfCurrency =
        mptSavedUserSettings.qfCurrency === undefined
          ? mptUserSettings.qfCurrency
          : mptSavedUserSettings.qfCurrency;
      mptUserSettings.qfEdition =
        mptSavedUserSettings.qfEdition === undefined
          ? mptUserSettings.qfEdition
          : mptSavedUserSettings.qfEdition;
    }
    // now render the settings section with any previously saved values:
    createUsersettings();
  }
  injectCss();

  if (window.top === window.self) {
    if (mptSettings.scriptEngine === 0) {
      startScript();
    } else {
      // execute language detection and afterwards functions for current page
      if (typeof window.addEventListener !== "undefined") {
        window.addEventListener("load", () => startScript(), false);
      } else {
        window.onload = () => startScript();
      }
    }
  }
})(); // end async for GM4

function toggleVis(target) {
  if (hasClass(target, "vis")) {
    target.setAttribute("class", "invis");
    target.style.display = "none";
  } else {
    target.setAttribute("class", "vis");
    target.style.display = "block";
  }
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
        await GM.setValue("mptUserSettings", null);
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
      return false;
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
  if (mptSettings.scriptEngine === 1) {
    GM.setValue("mptUserSettings", JSON.stringify(mptUserSettings));
  }
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

/**************************************** Get Language *****************************************/
function getPageLang() {
  // reset Notification due to pagechange
  printNotification("empty");
  // reset Editor Mode
  document.getElementById("mptStartparse").setAttribute("class", "invis");
  document.getElementById("mptStartparse").style.display = "none";
  mptSettings.itaLanguage = "en";
  mptSettings.retrycount = 1;
  if (window.location.href.indexOf("view-details") != -1) {
    setTimeout(function() {
      fePS();
    }, 200);
  } else if (
    window.location.href.indexOf("#search:") != -1 ||
    window.location.href == "https://matrix.itasoftware.com/" ||
    window.location.href == "https://matrix.itasoftware.com/"
  ) {
    setTimeout(function() {
      startPage();
    }, 200);
  }
}

function boolToEnabled(value) {
  if (value == 1) {
    return "enabled";
  } else {
    return "disabled";
  }
}
function findItinTarget(leg, seg, tcell) {
  var target = findtarget(classSettings.resultpage.itin, 1);
  if (!target) {
    printNotification("Error: Itin not found in findItinTarget-function");
    return;
  }

  // go to leg
  var targetLeg = target.nextElementSibling.children[leg - 1];
  if (targetLeg === undefined) {
    printNotification("Error: Leg not found in findItinTarget-function");
    return;
  }
  // go to segments of leg
  var targetSeg = targetLeg.children[1].children;
  if (targetSeg.length >= 2) {
    // go to desired segment
    var index = 0;
    var j = 0;
    let i = 0;
    for (i = 0; i < targetSeg.length; i++) {
      if (hasClass(targetSeg[i], classSettings.resultpage.itinRow)) {
        j++;
        if (j >= seg) {
          index = i;
          //special handling for one-seg-legs here
          if (targetSeg.length === 2 || targetSeg.length === 3) {
            // 1. Headline 2. Flight-details 3. arrival next day..
            index--;
          }
          break;
        }
      }
    } // end-for
    if (i == targetSeg.length) {
      //target not found
      printNotification(
        "Error: Call to unreachable Segment in Leg " +
          leg +
          " in findItinTarget-function"
      );
      return;
    }
    var rowoffset = 0;
    var columnoffset = 0;

    switch (tcell) {
      case "headline":
        // special case here allways first row... even in one-seg-legs
        rowoffset = index * -1;
        columnoffset = 1;
        break;
      case "logo":
        rowoffset = 0;
        columnoffset = 0;
        break;
      case "airportsdate":
        rowoffset = 0;
        columnoffset = 1;
        break;
      case "flight":
        rowoffset = 1;
        columnoffset = 0;
        break;
      case "deptime":
        rowoffset = 1;
        columnoffset = 1;
        break;
      case "arrtime":
        rowoffset = 1;
        columnoffset = 2;
        break;
      case "duration":
        rowoffset = 1;
        columnoffset = 2;
        break;
      case "plane":
        rowoffset = 1;
        columnoffset = 4;
        break;
      case "cabin":
        rowoffset = 1;
        columnoffset = 5;
        break;
      default:
        printNotification("Error: Unknown Target in findItinTarget-function");
        return;
    }
    return targetSeg[index + rowoffset].children[columnoffset];
  } else {
    printNotification("Error: Unknown error in findItinTarget-function");
    return;
  }
}
/********************************************* Start page *********************************************/
function startPage() {
  // try to get content
  if (findtarget(classSettings.startpage.maindiv, 1) === undefined) {
    printNotification("Error: Unable to find content on start page.");
    return false;
  } else {
    // apply style-fix
    const target = findtarget(classSettings.startpage.maindiv, 1);
    target.children[0].children[0].children[0].children[0].setAttribute(
      "valign",
      "top"
    );
  }
}
/********************************************* Result page *********************************************/
// editor functions
function bindEditorMode(dir) {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      // bind/unbind cabin & BC
      var target = findItinTarget(i + 1, j + 1, "cabin").firstElementChild;
      if (dir === "create") {
        var tmp = target.innerHTML;
        var bc = tmp.substr(tmp.length - 2, 1);
        var cabin = tmp.substr(0, tmp.length - 4);
        var cabins = [
          ["Economy", "Y"],
          ["Premium Economy", "Y+"],
          ["Business", "C"],
          ["First", "F"]
        ];
        var str = '<select style="width:40px" class="editoritem">';
        for (var k = 0; k < cabins.length; k++) {
          str +=
            '<option value="' +
            cabins[k][0] +
            '"' +
            (cabins[k][0] === cabin ? ' selected="selected"' : "") +
            ">" +
            cabins[k][1] +
            "</option>";
        }
        str += "</select>";
        str +=
          ' (<input type="text" class="editoritem" value="' +
          bc +
          '" style="width:20px;text-align:center">)';
      } else {
        var cabin =
          target.firstElementChild.options[
            target.firstElementChild.selectedIndex
          ].value;
        var bc = target.firstElementChild.nextElementSibling.value;
        var str = cabin + " (" + bc + ")";
      }
      target.innerHTML = str;
    }
  }
}

//Primary function for extracting flight data from ITA/Matrix
function fePS() {
  // try to get content
  const itin = findtarget(classSettings.resultpage.itin, 1);
  if (!itin) {
    printNotification("Error: Unable to find Content on result page.");
    return false;
  }
  // retry if itin not loaded
  if (itin.parentElement.previousElementSibling.style.display != "none") {
    mptSettings.retrycount++;
    if (mptSettings.retrycount > 50) {
      printNotification(
        "Error: Timeout on result page. Content not found after 10s."
      );
      return false;
    }
    setTimeout(function() {
      fePS();
    }, 200);
    return false;
  }
  // do some self-testing to prevent crashing on class-changes
  for (let i in classSettings.resultpage) {
    if (findtarget(classSettings.resultpage[i], 1) === undefined) {
      printNotification(
        "Error: Unable to find class " +
          classSettings.resultpage[i] +
          " for " +
          i +
          "."
      );
      return false;
    }
  }
  // empty outputcontainer
  if (document.getElementById("powertoolslinkcontainer") != undefined) {
    var div = document.getElementById("powertoolslinkcontainer");
    div.innerHTML = "";
  }

  //  S&D powertool items
  var elems = findtargets("powertoolsitem");
  for (var i = elems.length - 1; i >= 0; i--) {
    elems[i].parentElement.removeChild(elems[i]);
  }
  // S&D price breakdown
  var pbd = findtarget("pricebreakdown", 1);
  if (pbd != undefined) pbd.parentElement.removeChild(pbd);

  // S&D ff-Container
  var ffl = findtarget("ff-links", 1);
  if (ffl != undefined) ffl.parentElement.removeChild(ffl);
  var ffpc = findtarget("ff-plancontainer", 1);
  if (ffpc != undefined) ffpc.parentElement.removeChild(ffpc);
  var ffrcc = document.getElementById("ff-routingcodescontainer");
  if (ffrcc != undefined) ffrcc.parentElement.removeChild(ffrcc);

  readItinerary();

  // Editor mode?
  if (
    mptUserSettings.enableEditormode == 1 &&
    findtargets("editoritem").length === 0
  ) {
    toggleVis(document.getElementById("mptStartparse"));
    document.getElementById("mptStartparse").style.display = "inline-block";
    bindEditorMode("create");
    return false;
  } else if (findtargets("editoritem").length > 0) {
    bindEditorMode("remove");
    toggleVis(document.getElementById("mptStartparse"));
  }

  if (mptUserSettings.enableFarerules == 1) bindRulelinks();

  // configure sidebar
  if (mptUserSettings.enableInlineMode == 1) {
    findtarget(classSettings.resultpage.milagecontainer, 1).setAttribute(
      "rowspan",
      "10"
    );
    //findtarget('GE-ODR-BET',1).setAttribute('class', 'GE-ODR-BBFB');
  } else if (
    mptUserSettings.enableInlineMode == 0 &&
    mptUserSettings.enablePricebreakdown == 1
  ) {
    findtarget(classSettings.resultpage.milagecontainer, 1).setAttribute(
      "rowspan",
      "3"
    );
  } else {
    findtarget(classSettings.resultpage.milagecontainer, 1).setAttribute(
      "rowspan",
      "2"
    );
  }

  if (mptUserSettings.timeformat == "24h") {
    // lets do the time-replacement
    const segs = currentItin.itin
      .map(function(p) {
        return p.seg;
      })
      .reduce(function(a, b) {
        return a.concat(b);
      }, []);
    if (segs.length > 0) {
      const target = findtarget(classSettings.resultpage.itin, 1)
        .nextElementSibling;
      for (i = 0; i < segs.length; i++) {
        target.innerHTML = target.innerHTML.replace(
          new RegExp(segs[i].dep.timeDisplay, "g"),
          segs[i].dep.time24
        );
        target.innerHTML = target.innerHTML.replace(
          new RegExp(segs[i].arr.timeDisplay, "g"),
          segs[i].arr.time24
        );
      }
    }
  }

  // Translate page
  if (
    mptUserSettings.language !== "en" &&
    translations[mptUserSettings.language].resultpage !== undefined
  )
    translate(
      "resultpage",
      mptUserSettings.language,
      findtarget(classSettings.resultpage.itin, 1).nextElementSibling
    );
  //Add price breakdown
  if (mptUserSettings.enablePricebreakdown == 1) rearrangeprices();

  if (mptUserSettings.enableInlineMode == 1) printCPM();

  printLinksContainer();

  /*** inline binding ***/
  if (mptUserSettings.enableSeatguru == 1) bindSeatguru();
  if (mptUserSettings.enablePlanefinder == 1) bindPlanefinder();
  if (mptUserSettings.enableWheretocredit == 1) bindWheretocredit();
}

//*** Rulelinks ****//
function bindRulelinks() {
  var i = 0;
  var j = 0;
  var t = 1;
  let target = findtarget(classSettings.resultpage.rulescontainer, t);
  if (target != undefined) {
    do {
      var current = Number(
        target.firstElementChild.innerHTML.replace(/[^\d]/gi, "")
      );
      if (i > current) {
        j++;
        i = 0;
      }
      target = target.nextElementSibling.nextElementSibling.nextElementSibling;
      var targeturl =
        window.location.href.replace(/view-details/, "view-rules") +
        ";fare-key=" +
        j +
        "/" +
        i;
      var newlink = document.createElement("a");
      newlink.setAttribute("class", "gwt-Anchor");
      newlink.setAttribute("href", targeturl);
      newlink.setAttribute("target", "_blank");
      var linkText = document.createTextNode("rules");
      newlink.appendChild(linkText);
      target.parentElement.replaceChild(newlink, target);
      i++;
      t++;
      target = findtarget(classSettings.resultpage.rulescontainer, t);
    } while (target != undefined);
  }
}
//*** Price breakdown ****//
function rearrangeprices() {
  var basefares = 0;
  var taxes = 0;
  var surcharges = 0;
  var basefound = 0;
  var cur = "";
  // define searchpattern to detect carrier imposed surcharges
  var searchpatt = new RegExp("((YQ|YR))");
  var t = 1;
  var target = findtarget(classSettings.resultpage.htbLeft, t);
  if (mptUserSettings.enableInlineMode == 0) {
    var output = "";
    var count = 0;
  }
  if (target != undefined) {
    do {
      var type = target.firstChild.firstChild.nodeType;
      if (type == 1) {
        basefound = 1;
        //it's a basefare
        var price = Number(
          target.nextElementSibling.firstElementChild.innerHTML.replace(
            /[^\d]/gi,
            ""
          )
        );
        if (cur == "")
          cur = target.nextElementSibling.firstElementChild.innerHTML.replace(
            /[\d,.]/g,
            ""
          );
        basefares += price;
      } else if (basefound == 1 && type == 3) {
        //its a pricenode
        var name = target.firstElementChild.innerHTML;
        var price = Number(
          target.nextElementSibling.firstElementChild.innerHTML.replace(
            /[^\d]/gi,
            ""
          )
        );
        if (
          hasClass(
            target.nextElementSibling,
            classSettings.resultpage.htbGreyBorder
          )
        ) {
          //we are done for this container
          //console.log( "Basefare: "+ basefares);
          //console.log( "Taxes: "+ taxes);
          //console.log( "Surcharges: "+ surcharges);
          var sum = basefares + taxes + surcharges;
          if (mptUserSettings.enableInlineMode == 1) {
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Basefare per passenger (' +
              ((basefares / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbGreyBorder +
              '"><div class="gwt-Label">' +
              cur +
              (basefares / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Taxes per passenger (' +
              ((taxes / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbRight +
              '"><div class="gwt-Label">' +
              cur +
              (taxes / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Surcharges per passenger (' +
              ((surcharges / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbRight +
              '"><div class="gwt-Label">' +
              cur +
              (surcharges / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Basefare + Taxes per passenger (' +
              (((basefares + taxes) / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbGreyBorder +
              '"><div class="gwt-Label">' +
              cur +
              ((basefares + taxes) / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
          } else {
            count++;
            output += '<table style="float:left; margin-right:15px;"><tbody>';
            output +=
              '<tr><td colspan=3 style="text-align:center;">Price breakdown ' +
              count +
              ": </td></tr>";
            output +=
              "<tr><td>" +
              cur +
              ' per mile</td><td colspan=2 style="text-align:center;">' +
              (sum / currentItin.dist / 100).toFixed(4).toString() +
              "</td></tr>";
            output +=
              '<tr><td>Basefare</td><td style="padding:0px 3px;text-align:right;">' +
              ((basefares / sum) * 100).toFixed(1).toString() +
              '%</td><td style="text-align:right;">' +
              cur +
              (basefares / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output +=
              '<tr><td>Tax</td><td style="padding:0px 3px;text-align:right;">' +
              ((taxes / sum) * 100).toFixed(1).toString() +
              '%</td><td style="text-align:right;">' +
              cur +
              (taxes / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output +=
              '<tr><td>Surcharges</td><td style="padding:0px 3px;text-align:right;">' +
              ((surcharges / sum) * 100).toFixed(1).toString() +
              '%</td><td style="text-align:right;">' +
              cur +
              (surcharges / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output +=
              '<tr><td style="border-top: 1px solid #878787;padding:2px 0">Bf+Tax</td><td style="border-top: 1px solid #878787;padding:2px 3px;text-align:right;">' +
              (((basefares + taxes) / sum) * 100).toFixed(1).toString() +
              '%</td><td style="border-top: 1px solid #878787;padding:2px 0; text-align:right;">' +
              cur +
              ((basefares + taxes) / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output += "</tbody></table>";
          }
          currentItin.basefares = +(basefares / 100).toFixed(2);
          currentItin.taxes = +(taxes / 100).toFixed(2);
          currentItin.surcharges = +(surcharges / 100).toFixed(2);

          // reset var
          basefound = 0;
          basefares = 0;
          taxes = 0;
          surcharges = 0;
        } else {
          //Carrier surcharge?
          if (searchpatt.test(name) === true) {
            surcharges += price;
          } else {
            taxes += price;
          }
        }
      }
      t++;
      target = findtarget(classSettings.resultpage.htbLeft, t);
    } while (target != undefined);
  }
  if (mptUserSettings.enableInlineMode == 0) {
    var printtarget = findtarget(classSettings.resultpage.htbContainer, 1)
      .parentElement.parentElement.parentElement;
    var newtr = document.createElement("tr");
    newtr.setAttribute("class", "pricebreakdown");
    newtr.innerHTML = "<td><div>" + output + "</div></td>";
    printtarget.parentElement.insertBefore(newtr, printtarget);
  }
}

//*** Printfunctions ****//
function translate(page, lang, target) {
  if (translations[lang] === undefined) {
    printNotification("Error: Translation " + lang + " not found");
    return false;
  }
  if (translations[lang][page] === undefined) {
    printNotification(
      "Error: Translation " + lang + " not found for page " + page
    );
    return false;
  }
  for (let i in translations[lang][page]) {
    const re = new RegExp(i, "g");
    target.innerHTML = target.innerHTML.replace(
      re,
      translations[lang][page][i]
    );
  }
}

function printCPM() {
  printItemInline(
    (Number(currentItin.price) / Number(currentItin.dist)).toFixed(4) + " cpm",
    "",
    1
  );
}

function bindSeatguru() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      //walks each segment of leg
      var k = 0;
      // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
      while (j + k < currentItin.itin[i].seg.length - 1) {
        if (
          currentItin.itin[i].seg[j + k].fnr !=
            currentItin.itin[i].seg[j + k + 1].fnr ||
          currentItin.itin[i].seg[j + k].layoverduration >= 1440
        )
          break;
        k++;
      }
      // build the search to identify flight:
      var target = findItinTarget(i + 1, j + 1, "plane");
      if (!target) {
        printNotification("Error: Could not find target in bindSeatguru");
        return false;
      } else {
        var url =
          "http://www.seatguru.com/findseatmap/findseatmap.php?carrier=" +
          currentItin.itin[i].seg[j].carrier +
          "&flightno=" +
          currentItin.itin[i].seg[j].fnr +
          "&date=" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "%2F" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          "%2F" +
          currentItin.itin[i].seg[j].dep.year +
          "&to=&from=" +
          currentItin.itin[i].seg[j].orig;
        target.children[0].innerHTML =
          '<a href="' +
          url +
          '" target="_blank" style="text-decoration:none;color:black">' +
          target.children[0].innerHTML +
          "</a>";
      }
      j += k;
    }
  }
}
function bindPlanefinder() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      //walks each segment of leg
      var k = 0;
      // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
      while (j + k < currentItin.itin[i].seg.length - 1) {
        if (
          currentItin.itin[i].seg[j + k].fnr !=
            currentItin.itin[i].seg[j + k + 1].fnr ||
          currentItin.itin[i].seg[j + k].layoverduration >= 1440
        )
          break;
        k++;
      }
      // build the search to identify flight:
      var target = findItinTarget(i + 1, j + 1, "flight");
      if (!target) {
        printNotification("Error: Could not find target in bindPlanefinder");
        return false;
      } else {
        var url =
          "http://www.planefinder.net/data/flight/" +
          currentItin.itin[i].seg[j].carrier +
          currentItin.itin[i].seg[j].fnr;
        target.children[0].innerHTML =
          '<a href="' +
          url +
          '" target="_blank" style="text-decoration:none;color:black">' +
          target.children[0].innerHTML +
          "</a>";
      }
      j += k;
    }
  }
}

function bindWheretocredit() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      //walks each segment of leg
      var target = findItinTarget(i + 1, j + 1, "cabin");
      if (!target) {
        printNotification("Error: Could not find target in bindWheretocredit");
        return false;
      } else {
        var url =
          "http://www.wheretocredit.com/" +
          currentItin.itin[i].seg[j].carrier.toLowerCase() +
          "/" +
          currentItin.itin[i].seg[j].bookingclass.toLowerCase();
        target.children[0].innerHTML = target.children[0].innerHTML
          .replace(
            /<a.*?\/a>/,
            "(" + currentItin.itin[i].seg[j].bookingclass + ")"
          )
          .replace(
            "(" + currentItin.itin[i].seg[j].bookingclass + ")",
            '<a href="' +
              url +
              '" target="_blank" style="text-decoration:none;color:black">(' +
              currentItin.itin[i].seg[j].bookingclass +
              ")</a>"
          );
      }
    }
  }
}

function injectCss() {
  var css = "",
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");
  style.type = "text/css";

  css +=
    ".pt-hover-menu { position:absolute; padding: 8px; background-color: #FFF; border: 1px solid #808080; display:none; }";
  css += ".pt-hover-container:hover .pt-hover-menu { display:inline; }";

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
}
