import mptSettings, { reset } from "./settings/appSettings";
import { loadUserSettings } from "./settings/userSettings";
import classSettings from "./settings/itaSettings";
import { printNotification, findtarget } from "./utils";

import { readItinerary } from "./parse/itin";

import { render, cleanUp } from "./print";
import { createUsersettings } from "./print/settings";

/**************************************** Start Script *****************************************/

// *** DO NOT CHANGE BELOW THIS LINE***/
(async () => {
  await loadUserSettings();
  createUsersettings();
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

function startScript() {
  if (window.location.href !== mptSettings.laststatus) {
    setTimeout(function() {
      reset();
      cleanUp();
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

/**************************************** Get Language *****************************************/
function getPageLang() {
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

  readItinerary();
  render();
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
