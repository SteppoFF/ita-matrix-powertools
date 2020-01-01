import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";
import { getAmadeusUrl, getAmadeusPax } from "../../print/amadeus";

export const czEditions = [
  { value: "AR-GB", name: "Argentina / English" },
  { value: "AU-GB", name: "Australia / English" },
  { value: "AZ-GB", name: "Azerbaijan / English" },
  { value: "BD-GB", name: "Bangladesh / English" },
  { value: "BE-GB", name: "Belgium / English" },
  { value: "BR-GB", name: "Brazil / English" },
  { value: "KH-GB", name: "Cambodia / English" },
  { value: "CA-GB", name: "Canada / English" },
  { value: "CA-FR", name: "Canada / French" },
  { value: "CN-GB", name: "China / English" },
  { value: "DK-GB", name: "Denmark / English" },
  { value: "FI-GB", name: "Finland / English" },
  { value: "FR-GB", name: "France / English" },
  { value: "FR-FR", name: "France / French" },
  { value: "GE-GB", name: "Georgia / English" },
  { value: "DE-GB", name: "Germany / English" },
  { value: "DE-DE", name: "Germany / German" },
  { value: "GR-GB", name: "Greece / English" },
  { value: "HK-GB", name: "Hong Kong / English" },
  { value: "IN-GB", name: "India / English" },
  { value: "ID-GB", name: "Indonesia / English" },
  { value: "IR-GB", name: "Iran / English" },
  { value: "IE-GB", name: "Ireland / English" },
  { value: "IT-GB", name: "Italy / English" },
  { value: "JP-GB", name: "Japan / English" },
  { value: "JO-GB", name: "Jordan / English" },
  { value: "KZ-GB", name: "Kazakhstan / English" },
  { value: "KE-GB", name: "Kenya / English" },
  { value: "KG-GB", name: "Kyrgyzstan / English" },
  { value: "MY-GB", name: "Malaysia / English" },
  { value: "MV-GB", name: "Maldives / English" },
  { value: "MO-GB", name: "Macau / English" },
  { value: "MM-GB", name: "Myanmar / English" },
  { value: "NP-GB", name: "Nepal / English" },
  { value: "NL-GB", name: "Netherlands / English" },
  { value: "NZ-GB", name: "New Zealand / English" },
  { value: "NO-GB", name: "Norway / English" },
  { value: "PK-GB", name: "Pakistan / English" },
  { value: "PA-GB", name: "Panama / English" },
  { value: "PE-GB", name: "Peru / English" },
  { value: "PH-GB", name: "Philippines / English" },
  { value: "PT-GB", name: "Portugal / English" },
  { value: "RU-GB", name: "Russia / English" },
  { value: "SA-GB", name: "Saudi Arabia / English" },
  { value: "SG-GB", name: "Singapore / English" },
  { value: "ZA-GB", name: "South Africa / English" },
  { value: "KR-GB", name: "South Korea / English" },
  { value: "ES-GB", name: "Spain / English" },
  { value: "SE-GB", name: "Sweden / English" },
  { value: "CH-GB", name: "Switzerland / English" },
  { value: "TW-GB", name: "Taiwan / English" },
  { value: "TJ-GB", name: "Tajikistan / English" },
  { value: "TZ-GB", name: "Tanzania / English" },
  { value: "TH-GB", name: "Thailand / English" },
  { value: "TR-GB", name: "Turkey / English" },
  { value: "TM-GB", name: "Turkmenistan / English" },
  { value: "UA-GB", name: "Ukraine / English" },
  { value: "GB-GB", name: "United Kingdom / English" },
  { value: "AE-GB", name: "United Arab Emirates / English" },
  { value: "UG-GB", name: "Uganda / English" },
  { value: "US-GB", name: "United  States / English" },
  { value: "UZ-GB", name: "Uzbekistan / English" },
  { value: "VE-GB", name: "Venezuela / English" },
  { value: "VN-GB", name: "Vietnam / English" }
];

function printCZ() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(currentItin.itin.length >= 3 && inArray("CZ", currentItin.carriers))
  ) {
    return;
  }

  var createUrl = function(edition) {
    var paxConfig = { allowinf: 1, youthage: 0 };
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printCZ");
      return;
    }
    var amadeusConfig = {
      sepcabin: 0,
      detailed: 0,
      allowpremium: 0,
      inctimes: 0
    };
    var url =
      "http://global.csair.com/CZPortal/dyn/portal/doEnc?SITE=J00YJ00Y&BOOKING_FLOW=REVENUE&IS_FLEXIBLE=FALSE&LANGUAGE=" +
      edition[1] +
      "&PRICING_TYPE=O&COUNTRY_SITE=" +
      edition[0] +
      "&DISPLAY_TYPE=1";
    var tmpPax = getAmadeusPax(pax, paxConfig);
    url += tmpPax.url;
    url += "&NB_ADT=" + tmpPax.adults;
    url += "&NB_INF=" + tmpPax.infants;
    url += "&NB_CHD=" + tmpPax.children;
    url += "&TRIP_TYPE=M";
    url += getAmadeusUrl(amadeusConfig);
    return url;
  };
  // get edition
  var edition = mptUserSettings.czEdition.split("-");
  if (edition.length != 2) {
    printNotification("Error:Invalid CZ-Edition");
    return;
  }
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += czEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value.split("-")) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "China Southern",
    extra
  };
}

registerLink("airlines", printCZ);
