import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const laEditions = [
  { value: "es/ar", name: "Argentina / Spanish" },
  { value: "pt/br", name: "Brasil / Portuguese" },
  { value: "es/cl", name: "Chile / Spanish" },
  { value: "es/co", name: "Colombia / Spanish" },
  { value: "es/ec", name: "Ecuador / Spanish" },
  { value: "es/pe", name: "Peru / Spanish" },
  { value: "es/uy", name: "Uruguay / Spanish" },
  { value: "en/us", name: "US / English" },
  { value: "es/mx", name: "Mexico / Spanish" },
  { value: "en/ca", name: "Canada / English" },
  { value: "de/de", name: "Germany / German" },
  { value: "es/es", name: "Spain / Spanish" },
  { value: "fr/fr", name: "France / French" },
  { value: "en/it", name: "Italy / English" },
  { value: "en/uk", name: "UK / English" },
  { value: "en/ue", name: "Rest of Europe / English" },
  { value: "en/au", name: "Australia / English" },
  { value: "en/nz", name: "New Zealand / English" },
  { value: "es/un", name: "Other Countries / Spanish" },
  { value: "en/un", name: "Other Countries / English" }
];

function printLA() {
  if (
    !mptUserSettings.showAllAirlines &&
    !inArray("LA", currentItin.carriers)
  ) {
    return;
  }

  // NOTE: currency will be determined by the locale; the deeplink does not support manually specifying the currency
  var createUrl = function(edition) {
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printLA");
      return;
    }
    var laUrl = '"trip":{"flights":[';
    for (var i = 0; i < currentItin.itin.length; i++) {
      // amount and currency required for each segment:
      laUrl +=
        '{"amount":"' +
        currentItin.price +
        '","currency":"' +
        mptUserSettings.laCurrency +
        '","segments":[';
      var mincabin = 3;
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
        laUrl +=
          '{"departure_airport":"' +
          currentItin.itin[i].seg[j].orig +
          '","flight_number":"' +
          currentItin.itin[i].seg[j].fnr +
          '","departure_date":"' +
          currentItin.itin[i].seg[j].dep.year.toString() +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month.toString()).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day.toString()).slice(-2) +
          '","arrival_airport":"' +
          currentItin.itin[i].seg[j + k].dest +
          '","farebasis":"' +
          currentItin.itin[i].seg[j].farebase +
          '","marketing_airline":"' +
          currentItin.itin[i].seg[j].carrier +
          '","class":"' +
          currentItin.itin[i].seg[j].bookingclass +
          '","arrival_date":"' +
          currentItin.itin[i].seg[j].arr.year.toString() +
          "-" +
          ("0" + currentItin.itin[i].seg[j].arr.month.toString()).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].arr.day.toString()).slice(-2) +
          '"},';
        // check the minimum cabin:
        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
        j += k;
      }
      laUrl = laUrl.substring(0, laUrl.length - 1) + "]},";
    }
    // Build passengers info:
    var laPassengers =
      '"passengers":{"numberAdults":"' +
      pax.adults +
      '","numberInfants":"' +
      pax.infLap +
      '","numberChildren":"' +
      pax.children.length +
      '"},';
    // Compile the final URL (and encode it):
    laUrl =
      "https://ssl.lan.com/cgi-bin/compra/paso4.cgi?forced_home=" +
      edition +
      "&sessionParameters=%7B" +
      encodeURIComponent(laPassengers) +
      encodeURIComponent(laUrl.substring(0, laUrl.length - 1)) +
      "]}}&utm_medium=metasearch&utm_source=gfs&utm_campaign=US_deeplink_s4&gclsrc=gf";
    return laUrl;
  };
  var url = createUrl(mptUserSettings.laEdition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += laEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";
  return {
    url,
    title: "LATAM",
    extra
  };
}

registerLink("airlines", printLA);
