import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";
import {
  getAmadeusUrl,
  getAmadeusTriptype,
  getAmadeusPax
} from "../../print/amadeus";

export const lhEditions = [
  { value: "AL-gb", name: "Albania / English" },
  { value: "DZ-fr", name: "Algeria / Français" },
  { value: "AO-gb", name: "Angola / English" },
  { value: "AR-es", name: "Argentina / Español" },
  { value: "AM-gb", name: "Armenia / English" },
  { value: "AU-gb", name: "Australia / English" },
  { value: "AT-de", name: "Austria / Deutsch" },
  { value: "AT-gb", name: "Austria / English" },
  { value: "AZ-gb", name: "Azerbaijan / English" },
  { value: "BH-gb", name: "Bahrain / English" },
  { value: "BY-gb", name: "Belarus / English" },
  { value: "BE-gb", name: "Belgium / English" },
  { value: "BA-gb", name: "Bosnia/Hercegovina / English" },
  { value: "BR-pt", name: "Brazil / Português" },
  { value: "BG-gb", name: "Bulgaria / English" },
  { value: "CA-gb", name: "Canada / English" },
  { value: "CA-fr", name: "Canada / Français" },
  { value: "CL-es", name: "Chile / Español" },
  { value: "CN-gb", name: "China / English" },
  { value: "CO-es", name: "Colombia / Español" },
  { value: "HR-gb", name: "Croatia / English" },
  { value: "CY-gb", name: "Cyprus / English" },
  { value: "CZ-gb", name: "Czech Republic / English" },
  { value: "DK-gb", name: "Denmark / English" },
  { value: "EG-gb", name: "Egypt / English" },
  { value: "GQ-gb", name: "Equatorial Guinea / English" },
  { value: "ER-gb", name: "Eritrea / English" },
  { value: "EE-gb", name: "Estonia / English" },
  { value: "ET-gb", name: "Ethiopia / English" },
  { value: "FI-gb", name: "Finland / English" },
  { value: "FR-gb", name: "France / English" },
  { value: "FR-fr", name: "France / Français" },
  { value: "GA-gb", name: "Gabon / English" },
  { value: "GE-gb", name: "Georgia / English" },
  { value: "DE-de", name: "Germany / Deutsch" },
  { value: "DE-gb", name: "Germany / English" },
  { value: "GH-gb", name: "Ghana / English" },
  { value: "GR-gb", name: "Greece / English" },
  { value: "HK-gb", name: "Hong Kong / English" },
  { value: "HU-gb", name: "Hungary / English" },
  { value: "IS-gb", name: "Iceland / English" },
  { value: "IN-gb", name: "India / English" },
  { value: "ID-gb", name: "Indonesia / English" },
  { value: "IR-gb", name: "Iran / English" },
  { value: "IQ-gb", name: "Iraq / English" },
  { value: "IE-gb", name: "Ireland / English" },
  { value: "IL-gb", name: "Israel / English" },
  { value: "IT-it", name: "Italy / Italiano" },
  { value: "IT-gb", name: "Italy / English" },
  { value: "JP-gb", name: "Japan / English" },
  { value: "JO-gb", name: "Jordan / English" },
  { value: "KZ-gb", name: "Kazakhstan / English" },
  { value: "KE-gb", name: "Kenya / English" },
  { value: "KR-gb", name: "Republic of Korea / English" },
  { value: "KW-gb", name: "Kuwait / English" },
  { value: "LV-gb", name: "Latvia / English" },
  { value: "LB-gb", name: "Lebanon / English" },
  { value: "LY-gb", name: "Libya / English" },
  { value: "LT-gb", name: "Lithuania / English" },
  { value: "LU-gb", name: "Luxembourg / English" },
  { value: "MY-gb", name: "Malaysia / English" },
  { value: "MV-gb", name: "Maldives / English" },
  { value: "MT-gb", name: "Malta / English" },
  { value: "MU-gb", name: "Mauritius / English" },
  { value: "MX-es", name: "Mexico / Español" },
  { value: "MD-gb", name: "Moldova / English" },
  { value: "MA-fr", name: "Morocco / Français" },
  { value: "NL-gb", name: "Netherlands / English" },
  { value: "NZ-gb", name: "New Zealand / English" },
  { value: "NG-gb", name: "Nigeria / English" },
  { value: "NO-gb", name: "Norway / English" },
  { value: "OM-gb", name: "Oman / English" },
  { value: "PK-gb", name: "Pakistan / English" },
  { value: "PA-es", name: "Panama / Español" },
  { value: "PH-gb", name: "Philippines / English" },
  { value: "PL-gb", name: "Poland / English" },
  { value: "PL-pl", name: "Poland / Polski" },
  { value: "PT-gb", name: "Portugal / English" },
  { value: "PT-pt", name: "Portugal / Português" },
  { value: "QA-gb", name: "Qatar / English" },
  { value: "CD-gb", name: "Republic of the Congo / English" },
  { value: "RO-gb", name: "Romania / English" },
  { value: "RU-gb", name: "Russia / English" },
  { value: "RU-ru", name: "Russia / Русский" },
  { value: "SA-gb", name: "Saudi Arabia / English" },
  { value: "RS-gb", name: "Serbia / English" },
  { value: "SG-gb", name: "Singapore / English" },
  { value: "SK-gb", name: "Slovakia / English" },
  { value: "SI-gb", name: "Slovenia / English" },
  { value: "ZA-gb", name: "South Africa / English" },
  { value: "ES-gb", name: "Spain / English" },
  { value: "ES-es", name: "Spain / Español" },
  { value: "SD-gb", name: "Sudan / English" },
  { value: "SE-gb", name: "Sweden / English" },
  { value: "CH-de", name: "Switzerland / Deutsch" },
  { value: "CH-gb", name: "Switzerland / English" },
  { value: "CH-fr", name: "Switzerland / Français" },
  { value: "TW-gb", name: "Taiwan / English " },
  { value: "TH-gb", name: "Thailand / English" },
  { value: "TN-fr", name: "Tunisia / Français" },
  { value: "TR-gb", name: "Turkey / English" },
  { value: "TM-gb", name: "Turkmenistan / English" },
  { value: "UA-gb", name: "Ukraine / English" },
  { value: "AE-gb", name: "United Arab Emirates / English" },
  { value: "UK-gb", name: "United Kingdom / English" },
  { value: "US-gb", name: "United States / English" },
  { value: "VE-es", name: "Venezuela / Español" },
  { value: "VN-gb", name: "Vietnam / English" },
  { value: "XX-gb", name: "Other countries / English" }
];

function printLH() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(
      inArray("LH", currentItin.carriers) || inArray("OS", currentItin.carriers)
    )
  ) {
    return;
  }

  var createUrl = function(edition) {
    var style = 0; // 0 is direct booking - 1 is pre selected
    var paxConfig = { allowinf: 1, youthage: 0 };
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printLH");
      return false;
    }
    var amadeusConfig = {
      sepcabin: 0,
      detailed: 0,
      allowpremium: 1,
      inctimes: 0
    };
    if (style == 0) {
      var url =
        "https://book.lufthansa.com/lh/dyn/air-lh/revenue/availThenFare?";
      url += "WDS_MSE_PRICE_CURRENCY=EUR&WDS_MSE_TOTAL_PRICE=1.00&";
    } else {
      var url = "https://book.lufthansa.com/lh/dyn/air-lh/revenue/viewFlights?";
    }
    url +=
      "PORTAL=LH&COUNTRY_SITE=" +
      edition[0].toUpperCase() +
      "&POS=" +
      edition[0].toUpperCase() +
      "&LANGUAGE=" +
      edition[1].toUpperCase() +
      "&SECURE=TRUE&SITE=LUFTLUFT&SO_SITE_LH_FRONTEND_URL=www.lufthansa.com&WDS_WR_CHANNEL=LHCOM";
    var tmpPax = getAmadeusPax(pax, paxConfig);
    url += tmpPax.url;
    url += "&NB_ADT=" + tmpPax.adults;
    url += "&NB_INF=" + tmpPax.infants;
    url += "&NB_CHD=" + tmpPax.children;
    url += "&TRIP_TYPE=" + getAmadeusTriptype();
    url += getAmadeusUrl(amadeusConfig);

    return url;
  };
  // get edition
  var edition = mptUserSettings.lhEdition.split("-");
  if (edition.length != 2) {
    printNotification("Error:Invalid Lufthansa-Edition");
    return;
  }
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += lhEditions
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
    title: "Lufthansa",
    extra
  };
}

registerLink("airlines", printLH);
