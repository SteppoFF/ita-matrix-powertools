import mptSettings from "../../settings/appSettings";
import mptUserSettings, { registerSetting } from "../../settings/userSettings";
import translations from "../../settings/translations";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";
import {
  getAmadeusUrl,
  getAmadeusTriptype,
  getAmadeusPax
} from "../../print/amadeus";

const acEditions = [
  { name: "Algeria", value: "dz" },
  { name: "Antigua", value: "ag" },
  { name: "Argentina", value: "ar" },
  { name: "Australia", value: "au" },
  { name: "Austria", value: "at" },
  { name: "Bahamas", value: "bs" },
  { name: "Bahrain", value: "bh" },
  { name: "Barbados", value: "bb" },
  { name: "Belgium", value: "be" },
  { name: "Bermuda", value: "bm" },
  { name: "Canada", value: "ca" },
  { name: "Cayman Islands", value: "ky" },
  { name: "Chile", value: "cl" },
  { name: "China", value: "cn" },
  { name: "Colombia", value: "co" },
  { name: "Costa Rica", value: "cr" },
  { name: "Croatia", value: "hr" },
  { name: "Czech Republic", value: "cz" },
  { name: "Denmark", value: "dk" },
  { name: "Dominican Republic", value: "do" },
  { name: "Egypt", value: "eg" },
  { name: "Finland", value: "fi" },
  { name: "France", value: "fr" },
  { name: "Germany", value: "de" },
  { name: "Greece", value: "gr" },
  { name: "Haiti", value: "ht" },
  { name: "Hong Kong SAR, China", value: "hk" },
  { name: "Hungary", value: "hu" },
  { name: "India", value: "in" },
  { name: "Indonesia", value: "id" },
  { name: "Ireland", value: "ie" },
  { name: "Israel", value: "il" },
  { name: "Italy", value: "it" },
  { name: "Jamaica", value: "jm" },
  { name: "Japan", value: "jp" },
  { name: "Jordan", value: "jo" },
  { name: "Kuwait", value: "kw" },
  { name: "Malaysia", value: "my" },
  { name: "Mexico", value: "mx" },
  { name: "Morocco", value: "ma" },
  { name: "Mozambique", value: "mz" },
  { name: "Netherlands", value: "nl" },
  { name: "New Zealand", value: "nz" },
  { name: "Nigeria", value: "ng" },
  { name: "Norway", value: "no" },
  { name: "Panama", value: "pa" },
  { name: "Peru", value: "pe" },
  { name: "Poland", value: "pl" },
  { name: "Portugal", value: "pt" },
  { name: "Qatar", value: "qa" },
  { name: "Russia", value: "ru" },
  { name: "Romania", value: "ro" },
  { name: "Saudi Arabia", value: "sa" },
  { name: "Singapore", value: "sg" },
  { name: "South Africa", value: "za" },
  { name: "South Korea", value: "kr" },
  { name: "Spain", value: "es" },
  { name: "St. Lucia", value: "lc" },
  { name: "Sweden", value: "se" },
  { name: "Switzerland", value: "ch" },
  { name: "Taiwan, China", value: "tw" },
  { name: "Thailand", value: "th" },
  { name: "Trinidad &amp; Tobago", value: "tt" },
  { name: "Turkey", value: "tr" },
  { name: "Turks and Caicos Island", value: "tc" },
  { name: "Ukraine", value: "ua" },
  { name: "United Arab Emirates", value: "ae" },
  { name: "United Kingdom", value: "gb" },
  { name: "United States", value: "us" },
  { name: "Venezuela", value: "ve" },
  { name: "Vietnam", value: "vn" }
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
        createUrl(edition.value.toUpperCase()) +
        '" target="_blank">' +
        edition.name +
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
registerSetting("Air Canada", "acEdition", acEditions, "us");
