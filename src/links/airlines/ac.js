import mptSettings from "../../settings/appSettings";
import mptUserSettings from "../../settings/userSettings";
import translations from "../../settings/translations";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";
import {
  getAmadeusUrl,
  getAmadeusTriptype,
  getAmadeusPax
} from "../../print/amadeus";

export const acEditions = [
  "us",
  "ca",
  "ar",
  "au",
  "ch",
  "cl",
  "cn",
  "co",
  "de",
  "dk",
  "es",
  "fr",
  "gb",
  "hk",
  "ie",
  "il",
  "it",
  "jp",
  "mx",
  "nl",
  "no",
  "pa",
  "pe",
  "se"
];

function printAC() {
  var createUrl = function(edition) {
    var acUrl =
      "https://book.aircanada.com/pl/AConline/en/RedirectionServlet?FareRequest=YES&PRICING_MODE=0&fromThirdParty=YES";
    acUrl +=
      "&country=" +
      edition +
      "&countryOfResidence=" +
      edition +
      (mptSettings.itaLanguage == "de" || mptUserSettings.language == "de"
        ? "&language=de"
        : "&language=en");
    // validate Passengers here: Max Paxcount = 7 (Infs not included) - >11 = Adult - InfSeat = Child
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: true,
      childAsAdult: 16,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printAC");
      return;
    }
    var paxConfig = { allowinf: 0, youthage: 12 }; // AC does not allow booking of infants for int. flights
    var amadeusConfig = { sepcabin: 1, detailed: 1, allowpremium: 1 };
    var tmpPax = getAmadeusPax(pax, paxConfig);
    acUrl += tmpPax.url;
    acUrl += "&numberOfAdults=" + tmpPax.adults;
    acUrl += "&numberOfInfants=" + tmpPax.infants;
    acUrl += "&numberOfYouth=" + tmpPax.youth;
    acUrl += "&numberOfChildren=" + tmpPax.children;
    acUrl += "&tripType=" + getAmadeusTriptype();
    for (var i = 0; i < currentItin.itin.length; i++) {
      acUrl +=
        "&departure" +
        (i + 1) +
        "=" +
        ("0" + currentItin.itin[i].dep.day).slice(-2) +
        "/" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "/" +
        currentItin.itin[i].dep.year +
        "&org" +
        (i + 1) +
        "=" +
        currentItin.itin[i].orig +
        "&dest" +
        (i + 1) +
        "=" +
        currentItin.itin[i].dest;
    }
    acUrl += getAmadeusUrl(amadeusConfig);
    return acUrl;
  };
  var acUrl = createUrl(mptUserSettings.acEdition.toUpperCase());
  if (!acUrl) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += acEditions
    .map(function(edition, i) {
      return (
        '<a href="' +
        createUrl(edition.toUpperCase()) +
        '" target="_blank">' +
        edition +
        "</a>"
      );
    })
    .join("<br/>");
  extra += '<br/><a href="javascript:addACPromo();">Add Promo Code</a>';
  extra += "</span></span>";
  extra += addACPromoControls(acUrl);

  return {
    url: acUrl,
    title: "Air Canada",
    extra
  };
}

function addACPromoControls(url) {
  var script = document.createElement("script");
  script.appendChild(document.createTextNode("(" + addACPromo + ")();"));
  (document.body || document.head || document.documentElement).appendChild(
    script
  );

  var label = "Open";
  if (translations[mptUserSettings.language] !== undefined) {
    if (translations[mptUserSettings.language]["open"] !== undefined) {
      label = translations[mptUserSettings.language]["open"];
    }
  }

  var extra =
    '<input type="input" id="ac-promo-input" size="8" style="display:none;margin:0 5px;"></input>';
  extra +=
    '<label style="font-size:' + Number(mptUserSettings.linkFontsize) + '%;">';
  extra +=
    '<a id="ac-promo-link" style="display:none" target="_blank" href="' +
    url +
    '">' +
    label +
    "</a></label>";
  return extra;
}

function addACPromo() {
  window.addACPromo = function() {
    var input = document.getElementById("ac-promo-input");
    input.style.display = "inline";
    input.addEventListener("change", event => {
      var replacement =
        event.target.value != ""
          ? "&AUTHORIZATION_ID=" + event.target.value
          : "";
      var link = document.getElementById("ac-promo-link");
      var match = link.href.match(/(&AUTHORIZATION_ID=.*)/g);
      if (match == null) {
        link.href += replacement;
      } else {
        link.href = link.href.replace(match, replacement);
      }
    });

    var link = document.getElementById("ac-promo-link");
    link.style.display = "inline";
  };
}

registerLink("airlines", printAC);
