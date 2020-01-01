import mptUserSettings from "../settings/userSettings";
import classSettings from "../settings/itaSettings";
import translations from "../settings/translations";
import mtpPassengerConfig from "../settings/paxSettings";

import { currentItin } from "../parse/itin";
import { findtargets, findtarget } from "../utils";

/** @type {{ [key: string]: ((itin: typeof currentItin) => { url: string, title: string, desc?: string, nth?: number, extra?: string })[]}} */
const links = {
  airlines: [],
  meta: [],
  otas: []
};

require("../links");

export function printLinksContainer() {
  // do nothing if editor mode is active
  if (findtargets("editoritem").length > 0) {
    return false;
  }

  // empty outputcontainer
  if (document.getElementById("powertoolslinkcontainer") != undefined) {
    const div = document.getElementById("powertoolslinkcontainer");
    div.innerHTML = "";
  }

  //  S&D powertool items
  const elems = findtargets("powertoolsitem");
  for (let i = elems.length - 1; i >= 1; i--) {
    elems[i].parentElement.removeChild(elems[i]);
  }

  for (let group in links) {
    for (let i = 0; i < links[group].length; i++) {
      const link = links[group][i](currentItin);
      if (!link) continue;

      if (mptUserSettings.enableInlineMode == 1) {
        printUrlInline(link.url, link.title, link.desc, link.nth, link.extra);
      } else {
        printUrl(link.url, link.title, link.desc, link.extra);
      }
    }
    mptUserSettings.enableDeviders == 1 &&
      links[group].length &&
      printSeperator();
  }

  printGCM();
  printWheretocredit();
  /*** attach JS events after building link container  ***/
  bindLinkClicks();
}

function printGCM() {
  var url = "";
  // Build multi-city search based on segments
  // Keeping continous path as long as possible
  for (var i = 0; i < currentItin.itin.length; i++) {
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      url += currentItin.itin[i].seg[j].orig + "-";
      if (j + 1 < currentItin.itin[i].seg.length) {
        if (
          currentItin.itin[i].seg[j].dest != currentItin.itin[i].seg[j + 1].orig
        ) {
          url += currentItin.itin[i].seg[j].dest + ";";
        }
      } else {
        url += currentItin.itin[i].seg[j].dest + ";";
      }
    }
  }
  if (mptUserSettings.enableInlineMode == 1) {
    printImageInline(
      "http://www.gcmap.com/map?MR=900&MX=182x182&PM=*&P=" + url,
      "http://www.gcmap.com/mapui?P=" + url
    );
  } else {
    printUrl("http://www.gcmap.com/mapui?P=" + url, "GCM", "");
  }
}

function printWheretocredit() {
  var extra =
    '<span id="wheretocredit-container" style="display: none;">&nbsp;<img src="data:image/gif;base64,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" style="width: 1em; height: 1em;"></span>';

  var container;
  if (mptUserSettings.enableInlineMode == 1) {
    printUrlInline("javascript: void(0);", "wheretocredit.com", "", 1, extra);
    container = getSidebarContainer(1);
  } else {
    printUrl("javascript: void(0);", "wheretocredit.com", "", extra);
    container = document.getElementById("powertoolslinkcontainer");
  }

  var links = container.getElementsByTagName("a");
  var link = links[links.length - 1];
  link.target = "_self";
  link.innerHTML = "Calculate miles with wheretocredit.com";
}

function bindLinkClicks() {
  var container;
  var linkid = 0;
  if (mptUserSettings.enableInlineMode == 1) {
    container = getSidebarContainer(1);
  } else {
    container = document.getElementById("powertoolslinkcontainer");
  }
  var links = container.getElementsByTagName("a");
  /*
  if (typeof(currentItin.itin[0].dep.offset)==="undefined") {
    links[linkid].onclick=function () {
      resolveTimezones();
    };
    linkid++;
  }
  */
  if (mptUserSettings.enableInlineMode != 1) {
    linkid = links.length - 1;
  }
  links[linkid].onclick = function() {
    links[linkid].onclick = null;
    openWheretocredit(links[linkid]);
  };
}

function openWheretocredit(link) {
  var container = document.getElementById("wheretocredit-container");
  container.style.display = "inline";

  var itin = {
    ticketingCarrier:
      currentItin.carriers.length == 1 ? currentItin.carriers[0] : null,
    baseFareUSD: currentItin.basefares + currentItin.surcharges,
    segments: []
  };
  for (var i = 0; i < currentItin.itin.length; i++) {
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      itin.segments.push({
        origin: currentItin.itin[i].seg[j].orig,
        destination: currentItin.itin[i].seg[j].dest,
        departure: new Date(
          currentItin.itin[i].seg[j].dep.year,
          currentItin.itin[i].seg[j].dep.month,
          currentItin.itin[i].seg[j].dep.day
        ),
        carrier: currentItin.itin[i].seg[j].carrier,
        bookingClass: currentItin.itin[i].seg[j].bookingclass,
        codeshare: currentItin.itin[i].seg[j].codeshare,
        flightNumber: currentItin.itin[i].seg[j].fnr
      });
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.wheretocredit.com/api/beta/calculate");
  xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      link.href = "https://www.wheretocredit.com";
      link.target = "_blank";
      link.innerHTML = "Data provided by wheretocredit.com";

      var data, result, temp;
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        data = xhr.responseText;
      }

      if (
        xhr.status === 200 &&
        data &&
        data.success &&
        data.value &&
        data.value.length &&
        data.value[0].success
      ) {
        data.value[0].value.totals.sort(function(a, b) {
          if (a.value === b.value) {
            return +(a.name > b.name) || +(a.name === b.name) - 1;
          }
          return b.value - a.value; // desc
        });

        result = document.createElement("div");
        temp = data.value[0].value.totals.map(function(seg, i) {
          return (
            parseInt(seg.value)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            " " +
            seg.name +
            " miles"
          );
        });
        for (var i = 0; i < temp.length; i++) {
          result.appendChild(document.createTextNode(temp[i]));
          result.appendChild(document.createElement("br"));
        }
        result.removeChild(result.lastChild);
      } else {
        result = data.errorMessage || data || "API quota exceeded :-/";
        result = document.createTextNode(result);
      }
      container.style.display = "block";
      container.innerHTML = "";
      container.appendChild(result);
    }
  };
  xhr.send(JSON.stringify([itin]));
}

export function validatePaxcount(config) {
  //{maxPaxcount:7, countInf:false, childAsAdult:12, sepInfSeat:false, childMinAge:2}
  var tmpChildren = new Array();
  // push cur children
  for (var i = 0; i < mtpPassengerConfig.cAges.length; i++) {
    tmpChildren.push(mtpPassengerConfig.cAges[i]);
  }
  var ret = {
    adults: mtpPassengerConfig.adults,
    children: new Array(),
    infLap: mtpPassengerConfig.infantsLap,
    infSeat: 0
  };
  if (config.sepInfSeat === true) {
    ret.infSeat = mtpPassengerConfig.infantsSeat;
  } else {
    for (var i = 0; i < mtpPassengerConfig.infantsSeat; i++) {
      tmpChildren.push(config.childMinAge);
    }
  }
  // process children
  for (var i = 0; i < tmpChildren.length; i++) {
    if (tmpChildren[i] < config.childAsAdult) {
      ret.children.push(tmpChildren[i]);
    } else {
      ret.adults++;
    }
  }
  // check Pax-Count
  if (config.countInf === true) {
    if (
      config.maxPaxcount <
      ret.adults + ret.infLap + ret.infSeat + ret.children.length
    ) {
      console.log("Too many passengers");
      return;
    }
  } else {
    if (config.maxPaxcount < ret.adults + ret.infSeat + ret.children.length) {
      console.log("Too many passengers");
      return;
    }
  }
  if (0 === ret.adults + ret.infSeat + ret.children.length) {
    console.log("No passengers");
    return;
  }
  return ret;
}

/**
 * Registers a link
 * @param {keyof links} type
 * @param {(itin: typeof currentItin) => { url: string, title: string, desc?: string, nth?: number, extra?: string }} factory
 */
export function registerLink(type, factory) {
  links[type].push(factory);
}

// Inline Stuff
function printUrlInline(url, text, desc, nth, extra) {
  var otext = '<a href="' + url + '" target="_blank">';
  var valid = false;
  if (translations[mptUserSettings.language] !== undefined) {
    if (translations[mptUserSettings.language]["openwith"] !== undefined) {
      otext += translations[mptUserSettings.language]["openwith"];
      valid = true;
    }
  }
  otext += valid === false ? "Open with" : "";
  otext += " " + text + "</a>" + (extra || "");
  printItemInline(otext, desc, nth);
}

export function printItemInline(text, desc, nth) {
  const div = getSidebarContainer(nth);
  div.innerHTML =
    div.innerHTML +
    '<li class="powertoolsitem">' +
    text +
    (desc ? "<br/><small>(" + desc + ")</small>" : "") +
    "</li>";
}

export function printImageInline(src, url, nth) {
  const div = getSidebarContainer(nth).parentElement;
  if (mptUserSettings.enableIMGautoload == 1) {
    div.innerHTML =
      div.innerHTML +
      (url
        ? '<a href="' + url + '" target="_blank" class="powertoolsitem">'
        : "") +
      '<img src="' +
      src +
      '" style="margin-top:10px;"' +
      (!url ? ' class="powertoolsitem"' : "") +
      "/>" +
      (url ? "</a>" : "");
  } else {
    var id = Math.random().toString();
    div.innerHTML =
      div.innerHTML +
      '<div id="' +
      id +
      '" class="powertoolsitem" style="width:184px;height:100px;background-color:white;cursor:pointer;text-align:center;margin-top:10px;padding-top:84px;"><span>Click</span></div>';
    document.getElementById(id).onclick = function() {
      var newdiv = document.createElement("div");
      newdiv.setAttribute("class", "powertoolsitem");
      newdiv.innerHTML =
        (url ? '<a href="' + url + '" target="_blank">' : "") +
        '<img src="' +
        src +
        '" style="margin-top:10px;"' +
        (!url ? ' class="powertoolsitem"' : "") +
        "/>" +
        (url ? "</a>" : "");
      document
        .getElementById(id)
        .parentElement.replaceChild(newdiv, document.getElementById(id));
    };
  }
}

export function getSidebarContainer(nth) {
  var div =
    !nth || nth >= 4
      ? document.getElementById("powertoolslinkinlinecontainer")
      : findtarget(classSettings.resultpage.mcHeader, nth).nextElementSibling;
  return div || createUrlContainerInline();
}

function createUrlContainerInline() {
  var newdiv = document.createElement("div");
  newdiv.setAttribute("class", classSettings.resultpage.mcDiv);
  newdiv.innerHTML =
    '<div class="' +
    classSettings.resultpage.mcHeader +
    '">Powertools</div><ul id="powertoolslinkinlinecontainer" class="' +
    classSettings.resultpage.mcLinkList +
    '"></ul>';
  findtarget(classSettings.resultpage.mcDiv, 1).parentElement.appendChild(
    newdiv
  );
  return document.getElementById("powertoolslinkinlinecontainer");
}

// Printing Stuff
function printUrl(url, name, desc, extra) {
  if (document.getElementById("powertoolslinkcontainer") == undefined) {
    createUrlContainer();
  }
  var text =
    '<div style="margin:5px 0px 10px 0px"><label style="font-size:' +
    Number(mptUserSettings.linkFontsize) +
    '%;font-weight:600"><a href="' +
    url +
    '" target=_blank>';
  var valid = false;
  if (translations[mptUserSettings.language] !== undefined) {
    if (translations[mptUserSettings.language]["use"] !== undefined) {
      text += translations[mptUserSettings.language]["use"];
      valid = true;
    }
  }
  text += valid === false ? "Use " : "";
  text +=
    " " +
    name +
    "</a></label>" +
    (extra || "") +
    (desc
      ? '<br><label style="font-size:' +
        (Number(mptUserSettings.linkFontsize) - 15) +
        '%">(' +
        desc +
        ")</label>"
      : "") +
    "</div>";
  var target = document.getElementById("powertoolslinkcontainer");
  target.innerHTML = target.innerHTML + text;
}

function createUrlContainer() {
  var newdiv = document.createElement("div");
  newdiv.setAttribute("id", "powertoolslinkcontainer");
  newdiv.setAttribute("style", "margin:15px 0px 0px 10px");
  findtarget(
    classSettings.resultpage.htbContainer,
    1
  ).parentElement.parentElement.parentElement.appendChild(newdiv);
}

function printSeperator() {
  var container =
    document.getElementById("powertoolslinkcontainer") || getSidebarContainer();
  if (container) {
    container.innerHTML =
      container.innerHTML +
      (mptUserSettings.enableInlineMode
        ? '<hr class="powertoolsitem"/>'
        : "<hr/>");
  }
}
